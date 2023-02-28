import React from 'react';

import FormInput from '../FormMaterials/FormInput';

export default function getForm(materialComponent: string) {
  switch (materialComponent) {
    case 'text_input':
      return <FormInput className='w-full' />;
    default:
      return <FormInput className='w-full' />;
  }
}
