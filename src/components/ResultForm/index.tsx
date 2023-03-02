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
  const selectedFormMaterials = formData.steps[selectedForm - 1]?.materials;

  const submitForm = () => {
    if (selectedForm < formData.steps.length) {
      setSelectedStep(selectedForm + 1);
    }
  };
  return (
    <form
      className={classNames(
        'customScrollbar pt-6 p-2 flex flex-col w-full h-full max-w-[350px] overflow-y-auto items-center',
        {
          'text-white': formData.textColor
        }
      )}
    >
      <h4 className="font-medium text-[18px] my-3">{formData?.formName}</h4>
      {(selectedFormMaterials || []).map((item: any, index: number) => (
        <div key={index} className="w-full my-2">
          {getForm(item.component, item)}
        </div>
      ))}
      <Button
        classes="self-end w-full mt-auto"
        themeColor={formData?.buttonTheme}
        onClickHandler={submitForm}
        leftArrow
      >
        {formData.steps.length === selectedForm ? formData?.buttonText : 'Next'}
      </Button>
    </form>
  );
}
