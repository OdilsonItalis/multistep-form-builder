import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { Database } from 'types_db';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMedia: Database['public']['Tables']['media']['Row'] | null;
}

export default function MediaPreviewModal({
  open,
  setOpen,
  selectedMedia
}: Props) {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl flex flex-col aspect-square flex-shrink-0 max-h-screen transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all">
                  {selectedMedia?.type?.includes('video') ? (
                    <video
                      className={`object-contain mx-auto aspect-square h-full`}
                      controls
                      autoPlay
                    >
                      <source
                        src={selectedMedia?.media_url!}
                        type="video/mp4"
                      />
                    </video>
                  ) : (
                    <img
                      src={selectedMedia?.thumbnail_url!}
                      alt=""
                      className={`object-contain w-full mx-auto aspect-square`}
                    />
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
