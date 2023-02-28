import React from 'react';
import classNames from 'classnames';

import Button from '../FormMaterials/Button';

import getForm from './getForm';

interface ResultFormProps {
  formData: any;
  selectedForm: number;
}

export default function ResultForm({
  formData,
  selectedForm
}: ResultFormProps) {
  const selectedFormMaterials = formData.steps[selectedForm - 1]?.materials;
  return (
    <form
      className={classNames(
        'p-2 flex flex-col w-full h-full max-w-[350px] overflow-y-auto items-center',
        {
          'text-white': formData.textColor
        }
      )}
    >
      <h4 className="font-medium text-[18px] my-3">{formData?.formName}</h4>
      {(selectedFormMaterials || []).map((item: any, index: number) => (
        <div key={index} className="w-full">
          {getForm(item.component)}
        </div>
      ))}
      <Button
        classes="self-end w-full mt-auto"
        themeColor={formData?.buttonTheme}
        leftArrow
      >
        {formData.steps.length === selectedForm ? formData?.buttonText : 'Next'}
      </Button>
    </form>
  );
}
