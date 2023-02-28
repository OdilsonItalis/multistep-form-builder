import React from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '20%',
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

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function CreateNewMaterialModal({
  isOpen,
  closeModal
}: ModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
    ></Modal>
  );
}
