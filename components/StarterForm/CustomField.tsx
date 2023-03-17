import { changeField } from '@/utils/features/customFormSlice';
import { FormConfigInterface } from '@/utils/features/formConfigSlice';
import { getTheme } from '@/utils/getTheme';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

function CustomField({ field }: { field: FormConfigInterface }) {
  const { formConfiguration, theme } = useAppSelector(
    (state) => state.customForm
  );
  const dispatch = useAppDispatch();
  const { inactiveColor } = getTheme(theme);

  return (
    <div className=" h-full flex flex-col px-2 pb-2">
      <Toaster />
      <div className="form-control w-full ">
        <label className="label">
          <span className="label-text">
            {field.label}
            <span className="text-red-400">*</span>
          </span>
        </label>
        <input
          type={field.input}
          placeholder={field.placeholder || 'Enter your answer'}
          onChange={(e) => {
            dispatch(changeField({ key: field.label!, value: e.target.value }));
          }}
          className={`input input-bordered w-full rounded-none ${inactiveColor}`}
        />
      </div>
    </div>
  );
}

export default CustomField;
