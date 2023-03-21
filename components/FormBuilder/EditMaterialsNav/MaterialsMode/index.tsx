import React from 'react';

import ShortTextInput from './ShortTextInput';
import LongTextInput from './LongTextInput';
import Paragraph from './Paragraph';

export default function MaterialsMode({
  material,
  setSelectedMaterialEdit
}: {
  material: any;
  setSelectedMaterialEdit: (material: any) => void;
}) {
  switch (material.component) {
    case 'text_input':
      return (
        <ShortTextInput
          materialData={material}
          setSelectedMaterialEdit={setSelectedMaterialEdit}
        />
      );
    case 'long_text':
      return (
        <LongTextInput
          materialData={material}
          setSelectedMaterialEdit={setSelectedMaterialEdit}
        />
      );
    case 'paragraph':
      return (
        <Paragraph
          materialData={material}
          setSelectedMaterialEdit={setSelectedMaterialEdit}
        />
      );
    case 'custom_profile':
      return <p>This component is not allowed to edit</p>;
    default:
      return (
        <ShortTextInput
          materialData={material}
          setSelectedMaterialEdit={setSelectedMaterialEdit}
        />
      );
  }
}
