import React, { useRef } from 'react';
import Compressor from 'compressorjs';
import { toBase64 } from '@/utils/helpers';
import AddImageCameraIcon from 'public/icons/AddImageCameraIcon';

function AddImageSquareFullScreen({
  file,
  setFile
}: {
  file: string | null;
  setFile: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div
        onClick={(event) => {
          event.preventDefault();
          fileInputRef.current?.click();
        }}
        className="relative bg-green-100 w-full cursor-pointer"
      >
        <img
          className="aspect-square w-full object-cover"
          src={file || '/banner-placeholder.svg'}
        />
        <div className="text-white absolute inset-0 m-auto bg-black/30 rounded-full h-10 w-10 items-center justify-center flex">
          <AddImageCameraIcon height={20} width={20} color="white" />
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            new Compressor(file, {
              quality: 0.8,
              height: 640,
              width: 640,
              resize: 'cover',
              convertTypes: 'image/png', // here it converts to jpg after size exceeds 50kb
              convertSize: 50000,
              async success(result) {
                let base64 = await toBase64(result);
                setFile(base64 as string);
              }
            });
          } else {
            setFile(null);
          }
        }}
      />
    </>
  );
}

export default AddImageSquareFullScreen;
