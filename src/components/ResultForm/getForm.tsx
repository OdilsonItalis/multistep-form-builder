import React from 'react';

import FormInput from '../FormMaterials/FormInput';
import TextArea from '../FormMaterials/TextArea';
import Paragraph from '../FormMaterials/Paragraph';

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
    case 'long_text':
      return (
        <TextArea
          name={componentProps.name || ''}
          label={componentProps.label || ''}
          placeholder={componentProps.placeholder || ''}
        />
      );
    case 'paragraph':
      return <Paragraph textValue={componentProps.textValue} />;
    default:
      return <FormInput className="w-full" />;
  }
}
