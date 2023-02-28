import React from 'react';
import Modal from 'react-modal';

import Button from '../FormMaterials/Button';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 100
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 20
  }
};

Modal.setAppElement('#__next');

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title?: string;
  subTitle?: string;
  onSubmit?: () => void;
}

export default function ConfirmationModal({
  isOpen,
  closeModal,
  title,
  subTitle,
  onSubmit
}: ModalProps) {
  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <h4 className="text-[24px] font-medium">
        {title || 'Are you sure you want to delete?'}
      </h4>
      <p className="text-[16px] mt-1">
        {subTitle || 'Your changes may not be saved'}
      </p>
      <div className="mt-4 flex items-center justify-end">
        <Button
          classes="text-gray-800 mr-2"
          themeColor={'#f2f2f2'}
          onClickHandler={closeModal}
        >
          Cancel
        </Button>
        <Button
          classes="text-white"
          themeColor={'#ff0000'}
          onClickHandler={() => {
            if (onSubmit) onSubmit();
          }}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
