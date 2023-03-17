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

const AddImage: React.FC<Props> = () => {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState<
    'aspect-square' | 'aspect-[4/5]' | 'aspect-video' | 'aspect-[9/16]'
  >('aspect-square');
  const [thumbnail, setThumbnail] = useState<string | null>(null);

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

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setMedia(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setThumbnail(reader.result as string);
        setStep('EDIT_THUMBNAIL');
      };
    }
  };

  const handleFileUpload: SubmitHandler<{
    description: string;
  }> = async (data) => {
    if (media && thumbnail && user) {
      toast.loading('Uploading your picture...');
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
          description: data.description,
          order_number: 0
        })
        .select('*')
        .single();
      if (mediaUploadError) {
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

          if (mediaUploadError) {
            toast.dismiss();
            toast.error('Error uploading media');
            return;
          }
          const { error: thumbnailUpdateError } = await supabase
            .from('media')
            .update({
              thumbnail_url: `https://${process.env.NEXT_PUBLIC_SUPABASE_REFERENCE_ID}.supabase.co/storage/v1/object/public/user-content/${imageUploadData?.path}`
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
        {thumbnail && media && step === 'EDIT_THUMBNAIL' && (
          <button
            onClick={handleSubmit(handleFileUpload)}
            className="text-indigo-400 rounded-lg px-4 flex gap-1 h-10 items-center ml-auto"
          >
            <CheckIcon height={16} width={16} className="flex-none" />
            <p>Upload</p>
          </button>
        )}
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
        accept="image/*"
      />

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
          className={`${aspectRatio} object-cover flex w-1/2`}
          src={thumbnail || '/banner-placeholder.svg'}
          alt=""
        />
        <div className="form-control w-full">
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
    </div>
  );
};

export default AddImage;
