import React from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

import Button from '@/components/FormBuilder/FormMaterials/Button';

interface ModalProps {
  closeModal: () => void;
  title?: string;
  subTitle?: string;
  onSubmit?: () => void;
}
export default function ConfirmationModal({
  closeModal,
  title,
  subTitle,
  onSubmit
}: ModalProps) {
  return (
    <Dialog className="fixed inset-0 z-10" onClose={closeModal} open={true}>
      <div className="flex flex-col justify-center h-full px-1 pt-4">
        <Dialog.Overlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.4, ease: [0.36, 0.66, 0.04, 1] }
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] }
          }}
          className="fixed inset-0 bg-black/40"
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{
            y: 0,
            transition: { duration: 0.4, ease: [0.36, 0.66, 0.04, 1] }
          }}
          exit={{
            y: '100%',
            transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] }
          }}
          className="z-0 flex py-6 flex-col w-full bg-white rounded-lg shadow-xl px-6 max-w-2xl mx-auto relative"
        >
          <FaTimes
            onClick={closeModal}
            className="absolute top-[15px] right-[15px] text-gray-400 cursor-pointer"
          />
          <h4 className="text-[24px] font-medium text-gray-700">
            {title || 'Are you sure you want to delete?'}
          </h4>
          <p className="text-[16px] mt-1 text-gray-600">
            {subTitle || 'Your changes may not be saved'}
          </p>
          <div className="mt-4 flex items-center justify-end">
            <Button
              classes="text-gray-800 mr-2 text-[15px]"
              themeColor={'#f2f2f2'}
              onClickHandler={closeModal}
            >
              Cancel
            </Button>
            <Button
              classes="text-white text-[15px]"
              themeColor={'#ff0000'}
              onClickHandler={() => {
                if (onSubmit) onSubmit();
              }}
            >
              Confirm
            </Button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
}
