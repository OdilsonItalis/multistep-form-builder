import AddImageCameraIcon from 'public/icons/AddImageCameraIcon';
import React, { useRef, useState } from 'react';

const CaptureImage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [thumbnail, setThumbnail] = useState<string | null>(null);

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
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const URL = window.URL || (window as any).webkitURL;
    const videoUrl = URL.createObjectURL(file);
    if (videoRef.current) {
      videoRef.current.src = videoUrl;
    }
  };

  return (
    <div className="flex flex-col justify-center mx-auto pointer">
      {/* <button className="text-white relative rounded-full h-10 w-10 items-center justify-center flex cursor-pointer bg-orange-600/50 mx-auto my-4">
        <AddImageCameraIcon height={20} width={20} color="white" />
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="opacity-0 absolute inset-0 cursor-pointer h-10 w-10 z-10 cursor-pointer"
        />
      </button> */}

      {/* <div className="text-white absolute inset-0 m-auto bg-indigo-500/50 rounded-full h-10 w-10 items-center justify-center flex cursor-pointer">
        <AddImageCameraIcon height={20} width={20} color="white" />
      </div> */}
      <input
        type="file"
        accept="video/*"
        className="bg-red-500"
        ref={fileInputRef}
        onChange={handleFileInputChange}
      />
      <video ref={videoRef} width={400} height={300} controls>
        <source src="" type="video/mp4" />
      </video>
      <button onClick={captureImage} className="btn">
        Capture Thumbnail
      </button>
      <img
        className="aspect-[4/5] w-1/2 mx-auto object-cover"
        src={thumbnail || '/bannerplaceholder.svg'}
        alt=""
      />
    </div>
  );
};

export default CaptureImage;
