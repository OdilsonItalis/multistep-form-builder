import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { FaCheckCircle, FaPlus } from 'react-icons/fa';
import { toBase64 } from '@/utils/helpers';

import AddFormCustomBgTheme from '@/components/ImageUpload/AddFormCustomBgTheme';
import FormMaterialsList from './FormMaterialsList';

interface ControlNavProps {
  formData: any;
  setFormData: (formData: any) => void;
  resetNumber: number;
  openCreateNewMaterialModal: () => void;
  selectedStep: number;
  setSelectedMaterialEdit: (material: any) => void;
  selectedMaterialEdit: any;
}

export default function NewFormControlsNav({
  formData,
  setFormData,
  resetNumber,
  openCreateNewMaterialModal,
  selectedStep,
  setSelectedMaterialEdit,
  selectedMaterialEdit,

}: ControlNavProps) {
  const [selectedTheme, setSelectedTheme] = useState<number>(0);
  const [refreshNumber, setRefreshNumber] = useState<number>(0);
  const [file, setFile] = useState<File | Blob | null>(null);

  useEffect(() => {
    (async () => {
      if (
        file &&
        !formData.form_theme_backgrounds.find((item) => item.name === file.name)
      ) {
        let base64 = await toBase64(file);
        setFormData({
          ...formData,
          form_theme_backgrounds: [
            ...formData.form_theme_backgrounds,
            {
              name: file.name,
              url: base64 as string,
              text_color: '#ffffff',
              saved: false
            }
          ]
        });
      }
    })();
  }, [file]);

  const [stepFormData, setStepFormData] = useState<any>(
    formData.form_config[selectedStep - 1] || []
  );

  useEffect(() => {
    if (formData.background) {
      setSelectedTheme(
        formData.form_theme_backgrounds.findIndex(
          (item) => item.url === formData.background
        )
      );
    } else setSelectedTheme(0);
  }, [formData]);

  useEffect(() => {
    if (resetNumber !== refreshNumber) {
      setSelectedTheme(0);
      setRefreshNumber(resetNumber);
    }
  }, [resetNumber]);

  useEffect(() => {
    setStepFormData(formData.form_config[selectedStep - 1]);
  }, [selectedStep, formData]);

  const rearrangeMaterialsByDnD = (
    sourceIndex: number,
    destinationIndex: number
  ) => {
    let materials = stepFormData?.materials;
    const sourceMaterial = materials[sourceIndex];

    materials.splice(sourceIndex, 1);
    materials.splice(destinationIndex, 0, sourceMaterial);
    let stepsData = formData.form_config;
    stepsData[selectedStep - 1] = {
      ...stepsData[selectedStep - 1],
      materials: materials
    };
    setFormData({ ...formData, form_config: stepsData });
  };

  const deleteFormMaterial = (index: number) => {
    let materials = stepFormData?.materials;

    materials.splice(index, 1);
    let stepsData = formData.form_config;
    stepsData[selectedStep - 1] = {
      ...stepsData[selectedStep - 1],
      materials: materials
    };
    setFormData({ ...formData, form_config: stepsData });
  }
  return (
    <div className="border-0 md:border-r border-solid border-gray-200 w-full md:w-auto h-full pr-0 md:pr-8 flex flex-col">
      <p className="text-[16px] font-medium mb-1 md:mb-4">Background Theme</p>

      <div className="flex items-center overflow-x-auto w-full md:max-w-[250px] py-3">
        {formData.form_theme_backgrounds.map((item, index: number) => (
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
              onClick={() =>
                setFormData({
                  ...formData,
                  background: item.url === '' ? null : item.url,
                  text_color: item.url === '' ? null : item.text_color
                })
              }
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
            <p className="text-[12px] font-medium text-gray-500 whitespace-nowrap w-[45px] text-ellipsis overflow-hidden">
              {item.name}
            </p>
          </div>
        ))}
        <div className="flex flex-col items-center mr-4">
          <button
            type="button"
            className="w-[50px] h-[100px] rounded-[6px] bg-white overflow-hidden flex flex-col justify-center items-center relative cursor-pointer border-gray-400 border hover:bg-gray-200"
          >
            <AddFormCustomBgTheme file={file} setFile={setFile} />
          </button>

          <p className="text-[12px] font-medium text-gray-500">Custom</p>
        </div>
      </div>
      <p className="text-[16px] font-medium mb-4 mt-4">Components</p>
      <div className="flex-1 overflow-y-auto flex flex-col items-center">
        <FormMaterialsList
          formMaterials={stepFormData?.materials}
          selectedMaterialEdit={selectedMaterialEdit}
          setSelectedMaterialEdit={setSelectedMaterialEdit}
          rearrangeMaterialsByDnD={rearrangeMaterialsByDnD}
          deleteFormMaterial={deleteFormMaterial}
        />
        {/* {stepFormData?.materials.map((item: any, index: number) => (
          <div
            key={index}
            className={classNames(
              'group w-full bg-white py-1 px-2 h-[50px] flex items-center my-1 md:my-2 hover:bg-gray-100 cursor-default border border-solid border-gray-200 rounded-md',
              {
                'bg-gray-50': selectedMaterialEdit?.order === index
              }
            )}
          >
            <img src={item.icon} alt="Material Icon" className="w-[20px]" />
            <p
              className="font-medium ml-3 text-gray-800 cursor-pointer flex-1"
              onClick={() => setSelectedMaterialEdit({ ...item, order: index })}
            >
              {item.title}
            </p>
            <button className="hidden group-hover:flex ml-auto text-gray-600">
              <FaEllipsisV />
            </button>
          </div>
        ))} */}
        <button
          className="flex items-center text-blue-500 font-medium hover:text-blue-400 duration-[0.2s]"
          onClick={() => openCreateNewMaterialModal()}
        >
          <FaPlus className="mr-1" />
          Add new Component
        </button>
      </div>
    </div>
  );
}
