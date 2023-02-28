import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { FaCheckCircle, FaPlus, FaPlusCircle } from 'react-icons/fa';

interface ControlNavProps {
  formData: any;
  setFormData: (formData: any) => void;
  resetNumber: number;
  openCreateNewMaterialModal: () => void;
  selectedStep: number;
}

export default function NewFormControlsNav({
  formData,
  setFormData,
  resetNumber,
  openCreateNewMaterialModal,
  selectedStep
}: ControlNavProps) {
  const [selectedTheme, setSelectedTheme] = useState<number>(0);
  const [refreshNumber, setRefreshNumber] = useState<number>(0);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(
    formData.steps[selectedStep - 1]?.materials[0]
  );

  const [stepFormData, setStepFormData] = useState<any>(
    formData.steps[selectedStep - 1] || []
  );

  const fileUploadRef = useRef<any>(null);

  const themeBackgrounds = [
    { name: 'Default', url: '' },
    {
      name: 'Skype Blue',
      url: '/images/formThemeBackgrounds/skype_blue_gradient.png',
      textColor: '#ffffff'
    },
    {
      name: 'Red 123',
      url: '/images/formThemeBackgrounds/red_123.png',
      textColor: '#ffffff'
    }
  ];

  useEffect(() => {
    if (selectedTheme !== 0) {
      setFormData({
        ...formData,
        background: themeBackgrounds[selectedTheme].url,
        textColor: themeBackgrounds[selectedTheme].textColor
      });
    } else {
      setFormData({ ...formData, background: null, textColor: null });
    }
  }, [selectedTheme]);

  useEffect(() => {
    if (resetNumber !== refreshNumber) {
      setSelectedTheme(0);
      setRefreshNumber(resetNumber);
    }
  }, [resetNumber]);

  useEffect(() => {
    setStepFormData(formData.steps[selectedStep - 1]);
  }, [selectedStep, formData]);
  return (
    <div className="border-r border-solid border-gray-200 h-full">
      <p className="text-[16px] font-medium mb-4">Background Theme</p>

      {/* Custom image upload */}
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileUploadRef}
      />
      {/* Custom image upload */}

      <div className="flex items-center">
        {themeBackgrounds.map((item, index) => (
          <div key={index} className="flex flex-col items-center mr-4">
            <div
              className={classNames(
                'w-[50px] h-[100px] rounded-[6px] bg-white overflow-hidden flex justify-center items-center relative cursor-pointer hover:opacity-80',
                {
                  'border-gray-500 border':
                    index !== selectedTheme && index === 0
                },
                {
                  'border-violet-600 border-2':
                    index === selectedTheme && index === 0
                }
              )}
              onClick={() => setSelectedTheme(index)}
            >
              {item.url !== '' && (
                <img
                  src={item.url}
                  alt="Theme background"
                  className="w-full h-full"
                />
              )}
              {index === selectedTheme && (
                <FaCheckCircle
                  color="rgb(124 58 237)"
                  className="absolute z-10"
                />
              )}
            </div>
            <p className="text-[12px] font-medium text-gray-500">{item.name}</p>
          </div>
        ))}
        <div className="flex flex-col items-center mr-4">
          <button
            type="button"
            onClick={() => fileUploadRef.current.click()}
            className="w-[50px] h-[100px] rounded-[6px] bg-white overflow-hidden flex flex-col justify-center items-center relative cursor-pointer border-gray-400 border hover:bg-gray-200"
          >
            <FaPlusCircle color="#666666" />
            <p className="text-[10px] font-medium text-gray-500 mt-1">Upload</p>
          </button>

          <p className="text-[12px] font-medium text-gray-500">Custom</p>
        </div>
      </div>
      <p className="text-[16px] font-medium mb-4 mt-4">Components</p>
      {stepFormData?.materials.map((item: any, index: number) => (
        <div
          key={index}
          onClick={() => setSelectedMaterial({ ...item, order: index })}
          className={classNames("w-full py-1 px-2 flex items-center my-2 hover:bg-gray-100 cursor-default", {
            'bg-gray-100': selectedMaterial?.order === index
          })}
        >
          <img src={item.icon} alt="Material Icon" className="w-[40px]" />
          <p className="font-medium ml-3 text-gray-800">{item.title}</p>
        </div>
      ))}
      <button
        className="ml-4 flex items-center text-blue-500 font-medium hover:text-blue-400 duration-[0.2s]"
        onClick={() => openCreateNewMaterialModal()}
      >
        <FaPlus className="mr-1" />
        Add new Component
      </button>
    </div>
  );
}
