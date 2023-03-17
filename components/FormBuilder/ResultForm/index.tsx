import React from 'react';
import classNames from 'classnames';

import Button from '../FormMaterials/Button';

import getForm from './getForm';

interface ResultFormProps {
  formData: any;
  selectedForm: number;
  setSelectedStep: (step: number) => void;
}

export default function ResultForm({
  formData,
  selectedForm,
  setSelectedStep
}: ResultFormProps) {
  const selectedFormMaterials = formData.form_config[selectedForm - 1]?.materials;

  const submitForm = () => {
    if (selectedForm < formData.form_config.length) {
      setSelectedStep(selectedForm + 1);
    }
  };
  return (
    <form
      className={classNames(
        'customScrollbar p-0 md:pt-6 md:p-2 flex flex-col w-full h-full max-w-none md:max-w-[350px] overflow-y-auto items-center',
        {
          'text-white': formData.text_color
        }
      )}
    >
      <h4 className="font-medium text-[18px] my-3">{formData?.form_name}</h4>
      {(selectedFormMaterials || []).map((item: any, index: number) => (
        <div key={index} className="w-full my-2">
          {getForm(item.component, item)}
        </div>
      ))}
      <Button
        classes="self-end w-full mt-auto"
        themeColor={formData?.button_theme_color}
        onClickHandler={submitForm}
        leftArrow
      >
        {formData.form_config.length === selectedForm ? formData?.button_text : 'Next'}
      </Button>
    </form>
  );
}
