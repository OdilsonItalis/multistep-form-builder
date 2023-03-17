import AppBarBackUniversal from '@/components/Navigation/AppBarBackUniversal';
import { base64StringtoFile } from '@/utils/helpers';
import AddImageCameraIcon from 'public/icons/AddImageCameraIcon';
import CheckIcon from 'public/icons/CheckIcon';
import React, { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import Compressor from 'compressorjs';
import { supabase } from '@/utils/supabase-client';
import { useUser } from '@/utils/useUser';
import { SubmitHandler, useForm } from 'react-hook-form';

interface Props {
  onSelect?: (file: File) => void;
}

const AddVideo: React.FC<Props> = () => {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<
    'aspect-square' | 'aspect-[4/5]' | 'aspect-video' | 'aspect-[9/16]'
  >('aspect-square');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<{
    description: string;
  }>();

  function getDimensions(aspectRatio: string): {
    width: number;
    height: number;
  } {
    switch (aspectRatio) {
      case 'aspect-square':
        return { width: 1080, height: 1080 };
      case 'aspect-[4/5]':
        return { width: 1080, height: 1350 };
      case 'aspect-video':
        return { width: 1920, height: 1080 };
      case 'aspect-[9/16]':
        return { width: 1080, height: 1920 };
      default:
        return { width: 1080, height: 1080 };
    }
  }

  const [step, setStep] = useState<
    'ADD_MEDIA' | 'CAPTURE_THUMBNAIL' | 'EDIT_THUMBNAIL'
  >('ADD_MEDIA');

  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const handleButtonClick = (event: any) => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // reset the value
      fileInputRef.current.click();
    }
  };
  const handleButtonClick2 = () => {
    if (fileInputRef2.current) {
      fileInputRef2.current.value = ''; // reset the value
      fileInputRef2.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      // Check if file exceeds 50mb
      if (file.size > 50000000) {
        toast.error(
          'File size exceeds 50mb. We recommend using a video editor to reduce the file size.'
        );
        return;
      }
      setMedia(file);
      // checks if file is image or video

      const URL = window.URL || (window as any).webkitURL;
      const videoUrl = URL.createObjectURL(file);
      if (videoRef.current) {
        videoRef.current.src = videoUrl;
        setStep('CAPTURE_THUMBNAIL');
        // setIsPlaying(true);
      }
    }
  };

  const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setThumbnail(reader.result as string);
        setStep('EDIT_THUMBNAIL');
      };
      return;
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setThumbnail(imageDataUrl);
    setStep('EDIT_THUMBNAIL');
  };

  const handleFileUpload: SubmitHandler<{
    description: string;
  }> = async (data) => {
    if (media && thumbnail && user) {
      toast.loading('Uploading media...');
      const newImageFile = base64StringtoFile(thumbnail, 'thumbnail');
      if (!newImageFile) {
        toast.dismiss();
        toast.error('Error creating thumbnail');
        return;
      }
      const { data: mediaUploadData, error: mediaUploadError } = await supabase
        .from('media')
        .insert({
          created_by: user.id,
          type: media.type,
          size: media.size,
          aspect_ratio: aspectRatio,
          description: data.description
        })
        .select('*')
        .single();
      if (mediaUploadError) {
        console.log(mediaUploadError);
        toast.dismiss();
        toast.error('Error uploading media');
        return;
      }

      const { height, width } = getDimensions(aspectRatio);

      new Compressor(newImageFile, {
        quality: 0.8,
        height: height,
        width: width,
        resize: 'cover',
        convertTypes: 'image/png', // here it converts to jpg after size exceeds 50kb
        convertSize: 50000,
        async success(result) {
          const { data: imageUploadData, error: ImageUploadError } =
            await supabase.storage
              .from('user-content')
              .upload(
                `${user.id}/media/${mediaUploadData.id}.${result.type
                  .split('/')
                  .pop()}`,
                result,
                {
                  upsert: true
                }
              );
          if (ImageUploadError) {
            toast.dismiss();
            toast.error('Error uploading thumbnail');
            return;
          }
          const { data: fileUploadData, error: fileUploadError } =
            await supabase.storage
              .from('user-content')
              .upload(
                `${user.id}/media/${mediaUploadData.id}.${media.type
                  .split('/')
                  .pop()}`,
                media,
                {
                  upsert: true
                }
              );

          if (fileUploadError || mediaUploadError) {
            console.log(fileUploadError, mediaUploadError);
            toast.dismiss();
            toast.error('Error uploading media');
            return;
          }
          const { error: thumbnailUpdateError } = await supabase
            .from('media')
            .update({
              thumbnail_url: `https://${process.env.NEXT_PUBLIC_SUPABASE_REFERENCE_ID}.supabase.co/storage/v1/object/public/user-content/${imageUploadData?.path}`,
              media_url: `https://${process.env.NEXT_PUBLIC_SUPABASE_REFERENCE_ID}.supabase.co/storage/v1/object/public/user-content/${fileUploadData?.path}`
            })
            .eq('id', mediaUploadData.id);
          if (thumbnailUpdateError) {
            toast.dismiss();
            toast.error('Error updating thumbnail');
            return;
          }
          toast.dismiss();
          toast.success('Your media has been uploaded successfully!');
        }
      });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto min-h-screen">
      <div className="flex items-center">
        <AppBarBackUniversal />
        <button
          onClick={handleSubmit(handleFileUpload)}
          className="text-indigo-600 rounded-lg px-4 flex gap-1 h-10 items-center ml-auto"
        >
          <CheckIcon height={16} width={16} className="flex-none" />
          <p>Upload</p>
        </button>
      </div>
      <div
        className={`${
          step === 'ADD_MEDIA' ? 'flex' : 'hidden'
        } flex-col items-center flex-1 gap-2`}
      >
        <button
          className="bg-indigo-400 h-12 w-12 flex-shrink-0 rounded-full justify-center items-center flex"
          onClick={handleButtonClick}
        >
          <AddImageCameraIcon height={20} width={20} color="white" />
        </button>
        <h1 className="font-semibold text-indigo-400">Add media</h1>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="video/*"
      />
      <div
        className={`${
          step === 'CAPTURE_THUMBNAIL' ? 'flex' : 'hidden'
        } flex flex-col`}
      >
        <video
          // className={`w-full ${aspectRatio} object-cover`}
          className={`object-contain w-full sm:w-3/4 mx-auto aspect-square`}
          ref={videoRef}
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src="" type="video/mp4" />
        </video>
        <div className="flex flex-col gap-2 w-full sm:w-3/4 mx-auto py-2 px-2 sm:px-0">
          <button
            onClick={captureImage}
            className="bg-indigo-400 rounded-lg h-12 text-white flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
              />
            </svg>
            Capture thumbnail
          </button>
          <button
            onClick={handleButtonClick2}
            className="border border-indigo-400 rounded-lg h-12 flex items-center justify-center gap-2 text-indigo-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
              />
            </svg>

            <p>Add your own</p>
          </button>
          <input
            type="file"
            ref={fileInputRef2}
            onChange={handleFileChange2}
            style={{ display: 'none' }}
            accept="image/*"
          />
        </div>
      </div>

      <div
        className={`${
          step === 'EDIT_THUMBNAIL' ? 'flex' : 'hidden'
        } flex flex-col w-full items-center`}
      >
        <div className="flex gap-4 py-4">
          <div className="flex aspect-square cursor-pointer h-14 w-14 justify-center">
            <button
              onClick={() => setAspectRatio('aspect-square')}
              className="flex aspect-square items-center justify-center rounded-lg border-2 border-gray-600 hover:bg-gray-200 font-semibold text-sm"
            >
              1/1
            </button>
          </div>

          <div className="flex aspect-square cursor-pointer h-14 w-14 justify-center">
            <button
              onClick={() => setAspectRatio('aspect-[9/16]')}
              className="flex aspect-[9/16] items-center justify-center rounded-lg border-2 border-gray-600 hover:bg-gray-200 font-semibold text-sm"
            >
              9/16
            </button>
          </div>

          <div className="flex aspect-square cursor-pointer h-14 w-14 justify-center">
            <button
              onClick={() => setAspectRatio('aspect-[4/5]')}
              className="flex aspect-[4/5] items-center justify-center rounded-lg border-2 border-gray-600 hover:bg-gray-200 font-semibold text-sm"
            >
              4/5
            </button>
          </div>

          <div className="flex aspect-square cursor-pointer h-14 w-14 items-center justify-center">
            <button
              onClick={() => setAspectRatio('aspect-video')}
              className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-gray-600 hover:bg-gray-200 font-semibold text-sm"
            >
              16/9
            </button>
          </div>
        </div>
        <img
          className={`${aspectRatio} w-3/4 object-cover flex`}
          src={thumbnail || '/banner-placeholder.svg'}
          alt=""
        />
        <div className="form-control w-full px-2">
          <label className="label">
            <span className="label-text">Add your caption</span>
          </label>
          <textarea
            {...register('description')}
            className="textarea textarea-bordered"
            placeholder="Add your caption"
          ></textarea>
        </div>
      </div>
      {/* <div className="h-96 flex-shrink-0 bg-red-100">somehig</div>
      <div className="h-96 flex-shrink-0 bg-blue-100">somehig</div>
      <div className="h-96 flex-shrink-0 bg-green-100">somehig</div>
      <div className="h-96 flex-shrink-0 ">somehig</div> */}
      {/* {!isPlaying && media && (
          <svg
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.play();
              }
            }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-16 h-16 cursor-pointer inset-0 m-auto absolute"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )} */}
    </div>
  );
};

export default AddVideo;
