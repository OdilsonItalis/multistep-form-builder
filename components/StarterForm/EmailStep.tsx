import { changeField } from '@/utils/features/customFormSlice';
import { getTheme } from '@/utils/getTheme';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import React from 'react';

function EmailStep() {
  const { theme, email } = useAppSelector((state) => state.customForm);
  const dispatch = useAppDispatch();
  const usersTheme = getTheme(theme);

  return (
    <div className=" h-full flex flex-col px-2 pb-2">
      <div className="form-control w-full ">
        <label className="label">
          <span className="label-text font-semibold">
            What is your best email? <span className="text-red-400">*</span>
          </span>
        </label>
        <input
          type="email"
          placeholder="Email"
          value={email || ''}
          onChange={(e) =>
            dispatch(changeField({ key: 'email', value: e.target.value }))
          }
          className={`input input-bordered w-full rounded-none ${usersTheme.inactiveColor}`}
        />
      </div>
    </div>
  );
}

export default EmailStep;
