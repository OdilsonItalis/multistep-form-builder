import React, { useState, useEffect } from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';

import { formMaterials } from '@/utils/constants/formMaterials';
import useDeviceDetect from '@/utils/hooks/useDeviceDetect';

interface ModalProps {
  closeModal: () => void;
  setFormData: (formData: any) => void;
  formData: any;
  selectedStep: number;
}

export default function CreateNewMaterialsModal({
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
          className="z-0 flex py-6 flex-col w-full h-full md:h-auto bg-white rounded-lg shadow-xl px-6 max-w-2xl mx-auto relative"
        >
          <FaTimes onClick={closeModal} className="absolute top-[15px] right-[15px] text-gray-400 cursor-pointer" />
          <h4 className="text-[24px] font-medium text-center">
            Form Materials
          </h4>
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
          <div className="flex flex-wrap mt-4">
            {materials.map((item) => (
              <div
                key={item.component}
                onClick={() => {
                  let formConfig = [...formData.form_config];
                  const stepIndex = selectedStep - 1;
                  formConfig[stepIndex] = {
                    ...formConfig[stepIndex],
                    materials: [...formConfig[stepIndex].materials, item]
                  };
                  setFormData({
                    ...formData,
                    form_config: formConfig
                  });
                  closeModal();
                }}
                className="flex items-center w-[250px] rounded-md hover:bg-gray-100 cursor-default my-1 py-1.5 px-2"
              >
                <span className="rounded-sm w-[25px] h-[25px] flex items-center justify-center bg-gray-300">
                  <img
                    src={item.icon}
                    className="w-[17px]"
                    alt="Component Icon"
                  />
                </span>
                <p className="text-[14px] font-medium text-gray-800 ml-2">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
}
