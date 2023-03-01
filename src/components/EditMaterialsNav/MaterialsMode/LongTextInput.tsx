import React from 'react';

interface Props {
  materialData: any;
  setSelectedMaterialEdit: (material: any) => void;
}

export default function LongTextInput({
  materialData,
  setSelectedMaterialEdit
}: Props) {
  const onChangeEdits = (key: string, editValue: string) => {
    setSelectedMaterialEdit({ ...materialData, [key]: editValue });
  };

  return (
    <div>
      <div className="w-full mb-4">
        <p className="text-[14px] font-medium text-gray-600 my-2">Name</p>
        <input
          value={materialData?.name}
          onChange={(e) => onChangeEdits('name', e.target.value)}
          className="h-[35px] rounded-md border border-solid border-gray-200 focus:outline-none px-4"
        />
      </div>
      <div className="w-full mb-4">
        <p className="text-[14px] font-medium text-gray-600 my-2">
          Placeholder
        </p>
        <input
          value={materialData?.placeholder}
          onChange={(e) => onChangeEdits('placeholder', e.target.value)}
          className="h-[35px] w-full rounded-md border border-solid border-gray-200 focus:outline-none px-4"
        />
      </div>
      <div className="w-full mb-4">
        <p className="text-[14px] font-medium text-gray-600 my-2">label</p>
        <input
          value={materialData?.nlabelame}
          onChange={(e) => onChangeEdits('label', e.target.value)}
          className="h-[35px] w-full rounded-md border border-solid border-gray-200 focus:outline-none px-4"
        />
      </div>
    </div>
  );
}
