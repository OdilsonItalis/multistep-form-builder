import React from 'react';

import ShortTextInput from './ShortTextInput';

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
    default:
      return (
        <ShortTextInput
          materialData={material}
          setSelectedMaterialEdit={setSelectedMaterialEdit}
        />
      );
  }
}
