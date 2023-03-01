import React from 'react';

interface Props {
  materialData: any;
  setSelectedMaterialEdit: (material: any) => void;
}

export default function ShortTextInput({
  materialData,
  setSelectedMaterialEdit
}: Props) {
  const onChangeEdits = (key: string, editValue: string) => {
    setSelectedMaterialEdit({ ...materialData, [key]: editValue });
  };
  return (
    <div>
      <div className="w-full mb-4">
        <p className="text-[14px] font-medium text-gray-600 my-2">Type</p>
        <select
          value={materialData?.type}
          onChange={(e) => onChangeEdits('type', e.target.value)}
          className="border border-solid border-gray-200 rounded-md h-[35px] px-2 w-1/2 focus:outline-none"
        >
          <option value="text">Default (text)</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
        </select>
      </div>
      <div className="w-full mb-4">
        <p className="text-[14px] font-medium text-gray-600 my-2">Name</p>
        <input
          value={materialData?.name}
          onChange={(e) => onChangeEdits('name', e.target.value)}
          className="h-[35px] rounded-md border border-solid border-gray-200 focus:outline-none px-4"
        />
      </div>
      <div className="w-full mb-4">
        <p className="text-[14px] font-medium text-gray-600 my-2">Label</p>
        <input
          value={materialData?.label}
          onChange={(e) => onChangeEdits('label', e.target.value)}
          className="w-full h-[35px] rounded-md border border-solid border-gray-200 focus:outline-none px-4"
        />
      </div>
      <div className="w-full mb-4">
        <p className="text-[14px] font-medium text-gray-600 my-2">
          Placeholder
        </p>
        <input
          value={materialData?.placeholder}
          onChange={(e) => onChangeEdits('placeholder', e.target.value)}
          className="w-full h-[35px] rounded-md border border-solid border-gray-200 focus:outline-none px-4"
        />
      </div>
    </div>
  );
}
