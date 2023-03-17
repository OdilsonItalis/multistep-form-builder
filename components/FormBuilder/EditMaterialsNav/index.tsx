import React from 'react';
import { FaAngleDown } from 'react-icons/fa';

import MaterialsMode from './MaterialsMode';

interface EditMaterialProps {
  selectedMaterialEdit: any;
  setSelectedMaterialEdit: (material: any) => void;
}

export default function EditMaterialNav({
  selectedMaterialEdit,
  setSelectedMaterialEdit
}: EditMaterialProps) {
  return (
    <div className="w-full md:w-[350px] h-[calc(100%-75px)] z-10 bg-white animate-slideTop overflow-hidden absolute right-0 bottom-0 border border-solid border-gray-200">
      <button
        onClick={() => setSelectedMaterialEdit(null)}
        className="w-full h-[45px] md:h-[30px] border-b border-solid border-gray-200 flex justify-center items-center bg-gray-50 hover:bg-gray-100 duration-[0.2s]"
      >
        <FaAngleDown />
      </button>
      <div className="p-4">
        <MaterialsMode
          material={selectedMaterialEdit}
          setSelectedMaterialEdit={setSelectedMaterialEdit}
        />
      </div>
    </div>
  );
}
