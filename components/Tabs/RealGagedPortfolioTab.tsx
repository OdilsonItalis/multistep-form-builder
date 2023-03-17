import { useGetMedias } from '@/utils/hooks/useGetMedias';
import { FaGripVertical } from 'react-icons/fa';
import { useGetPublicUser } from '@/utils/hooks/userHooks';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Database } from 'types_db';
import MediaPreviewModal from '../Modals/MediaPreviewModal';

function RealGagedPortfolioTab() {
  const router = useRouter();
  const { id } = router.query;
  const { data: publicProfile } = useGetPublicUser(id as string | undefined);
  const { data, isLoading, error } = useGetMedias(publicProfile?.id as string);
  let [isOpen, setIsOpen] = useState(false);

  const [selectedMedia, setSelectedMedia] = useState<
    Database['public']['Tables']['media']['Row'] | null
  >(null);

  const handleMediaClicked = (
    media: Database['public']['Tables']['media']['Row']
  ) => {
    console.log(media.id);
    setIsOpen(true);
    setSelectedMedia(media);
  };

  console.log({
    data,
    isLoading,
    error
  });

  return (
    <div className="p-4 sm:p-0 max-w-4xl mx-auto">
      <div className="columns-2 gap-4 sm:gap-8 sm:columns-3">
        {data?.data?.map((media, index) => {
          return (
            <div onClick={() => handleMediaClicked(media)} className="relative">
              {!media.type?.includes('video') && (
                <img
                  src={media.thumbnail_url || '/banner-placeholder.svg'}
                  alt=""
                  className={`hover:brightness-75 cursor-pointer object-cover ${
                    media.aspect_ratio
                  }
                } ${index !== 0 ? 'mt-4 sm:mt-8' : ''}`}
                />
              )}
              {media.type?.includes('video') && (
                <div
                  className={`relative overflow-hidden group ${
                    index !== 0 ? 'mt-4 sm:mt-8' : ''
                  }`}
                >
                  <video
                    muted={true}
                    onMouseOver={(e) => {
                      const target = e.target as HTMLVideoElement;
                      target.play();
                    }}
                    onMouseOut={(e) => {
                      const target = e.target as HTMLVideoElement;
                      target.pause();
                      target.currentTime = 0;
                    }}
                  >
                    <source src={media.media_url as string} type="video/mp4" />
                  </video>
                  <img
                    src={media.thumbnail_url || '/banner-placeholder.svg'}
                    alt=""
                    className={`absolute w-full top-0 left-0 group-hover:hidden`}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-16 h-16 cursor-pointer inset-0 m-auto absolute"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
        <MediaPreviewModal
          open={isOpen}
          setOpen={setIsOpen}
          selectedMedia={selectedMedia}
        />
      </div>
    </div>
  );
}

export default RealGagedPortfolioTab;
