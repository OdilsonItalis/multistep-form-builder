import React from 'react';

interface Props {
  materialData: any;
  setSelectedMaterialEdit: (material: any) => void;
}

export default function Paragraph({
  materialData,
  setSelectedMaterialEdit
}: Props) {
  const onChangeEdits = (key: string, editValue: string) => {
    setSelectedMaterialEdit({ ...materialData, [key]: editValue });
  };
  return (
    <div>
      <div className="w-full mb-4">
        <p className="text-[14px] font-medium text-gray-600 my-2">Text Value</p>
        <textarea
          value={materialData?.textValue}
          onChange={(e) => onChangeEdits('textValue', e.target.value)}
          className="w-full rounded-md border border-solid border-gray-200 focus:outline-none p-3"
        />
      </div>
    </div>
  );
}
