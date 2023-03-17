import React, { useRef, useState } from 'react';

function VideoPreview() {
  const videoUrl =
    'https://tyszadxvwfutwxikbyad.supabase.co/storage/v1/object/public/user-content/d8f8b051-9671-4dc5-a6eb-ae4d81967072/media/4.mp4';

  const thumbnailUrl =
    'https://tyszadxvwfutwxikbyad.supabase.co/storage/v1/object/public/user-content/d8f8b051-9671-4dc5-a6eb-ae4d81967072/media/4.jpeg';

  const videoRef = useRef(null);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const playVideo = () => {
    setShowThumbnail(false);
    videoRef?.current?.play();
  };

  const pauseVideo = () => {
    setShowThumbnail(true);
    videoRef?.current?.pause();
  };

  const onEnded = () => {
    setShowThumbnail(true);
  };

  return (
    <div className="flex h-full mx-auto">
      {showThumbnail ? (
        <img
          src={thumbnailUrl}
          alt="Video Thumbnail"
          className="mx-auto object-cover aspect-[9/16]"
          //   onMouseEnter={playVideo}
          onClick={playVideo}
        />
      ) : null}
      <video
        ref={videoRef}
        src={videoUrl}
        className={`mx-auto aspect-[9/16] ${showThumbnail ? 'hidden' : ''}`}
        controls
        onPlay={playVideo}
        onPause={pauseVideo}
        onEnded={onEnded}
      />
    </div>
  );
}

export default VideoPreview;
