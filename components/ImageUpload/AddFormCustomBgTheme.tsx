import React, { useRef } from 'react';
import Compressor from 'compressorjs';
import AddImageCameraIcon from 'public/icons/AddImageCameraIcon';

function AddFormCustomBgTheme({
  file,
  setFile
}: {
  file: File | Blob | null;
  setFile: React.Dispatch<React.SetStateAction<File | Blob | null>>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <div
        onClick={(event) => {
          event.preventDefault();
          fileInputRef.current?.click();
        }}
        className="relative w-full h-full cursor-pointer"
      >
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
              convertTypes: 'image/png',
              convertSize: 50000,
              async success(result) {
                setFile(result);
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

export default AddFormCustomBgTheme;
