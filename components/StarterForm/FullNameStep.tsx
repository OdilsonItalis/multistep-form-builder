import { changeField } from '@/utils/features/customFormSlice';
import { getTheme } from '@/utils/getTheme';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import React from 'react';

function FullNameStep() {
  const { step, theme, fullName } = useAppSelector((state) => state.customForm);
  const dispatch = useAppDispatch();
  const { activeColor, inactiveColor } = getTheme(theme);

  return (
    <div className="form-control w-full px-2">
      <label className="label">
        <span className="label-text font-semibold">
          What is your full name? <span className="text-red-400">*</span>
        </span>
      </label>
      <input
        type="text"
        value={fullName || ''}
        onChange={(e) =>
          dispatch(changeField({ key: 'fullName', value: e.target.value }))
        }
        placeholder="Enter your full name"
        autoComplete="off"
        className={`input input-bordered w-full rounded-none ${inactiveColor}`}
      />
    </div>
  );
}

export default FullNameStep;
