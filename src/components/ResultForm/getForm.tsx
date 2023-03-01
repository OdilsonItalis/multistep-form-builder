import React from 'react';

import FormInput from '../FormMaterials/FormInput';

export default function getForm(
  materialComponent: string,
  componentProps: any
) {
  switch (materialComponent) {
    case 'text_input':
      return (
        <FormInput
          name={componentProps.name || ''}
          placeholder={componentProps.placeholder || ''}
          type={componentProps.type || 'text'}
          label={componentProps.label || ''}
          className={`w-full mt-1 ${componentProps.className || ''}`}
        />
      );
    default:
      return <FormInput className="w-full" />;
  }
}
