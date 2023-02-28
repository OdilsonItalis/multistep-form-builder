import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaTimes, FaSearch } from 'react-icons/fa';

import { formMaterials } from '../../../utils/constants/formMaterials';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 100,
    width: '60%',
    height: '70%'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 20
  }
};

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  setFormData: (formData: any) => void;
  formData: any;
  selectedStep: number;
}

export default function CreateNewMaterialModal({
  isOpen,
  closeModal,
  formData,
  setFormData,
  selectedStep
}: ModalProps) {
  const [search, setSearch] = useState<string>('');
  const [materials, setMaterials] = useState<any[]>(formMaterials);

  useEffect(() => {
    if (search !== '') {
      setMaterials(
        formMaterials.filter(
          (item) => item.title.toLowerCase().indexOf(search.toLowerCase()) > -1
        )
      );
    } else {
      setMaterials(formMaterials);
    }
  }, [search]);
  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <button className="absolute right-[10px] top-[10px]" onClick={closeModal}>
        <FaTimes />
      </button>

      <h4 className="text-[24px] font-medium text-center">Form Materials</h4>
      <div className="w-full h-[40px] flex items-center mt-3 rounded-md border border-solid border-gray-300 px-4">
        <FaSearch color="#999999" />
        <input
          type="text"
          value={search}
          className="flex-1 h-full focus:outline-none ml-2"
          placeholder="Find material"
          onChange={(e) => setSearch(e.target.value)}
        />
        {search !== '' && (
          <button
            className="text-gray-600 cursor-pointer"
            onClick={() => setSearch('')}
          >
            <FaTimes />
          </button>
        )}
      </div>
      <div className="flex flex-col flex-wrap mt-4">
        {materials.map((item) => (
          <div
            key={item.component}
            onClick={() => {
              let steps = formData.steps;
              const stepIndex = selectedStep - 1;
              steps[stepIndex] = {
                ...steps[stepIndex],
                materials: [...steps[stepIndex].materials, item]
              };
              setFormData({
                ...formData,
                steps
              });
              closeModal();
            }}
            className="flex items-center w-[250px] rounded-md hover:bg-gray-200 cursor-default"
          >
            <img src={item.icon} className="w-[40px]" alt="Component Icon" />
            <p className="text-[14px] font-medium text-gray-800">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </Modal>
  );
}
