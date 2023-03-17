import { changeField } from '@/utils/features/customFormSlice';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import React from 'react';
import { Toaster } from 'react-hot-toast';

function DobStep() {
  const { dateOfBirth } = useAppSelector((state) => state.customForm);
  const dispatch = useAppDispatch();
  const todaysDate = new Date().toISOString().split('T')[0];

  return (
    <>
      <Toaster />
      <div className="form-control w-full ">
        <label className="label">
          <span className="label-text font-semibold">
            What is your date of birth? <span className="text-red-400">*</span>
          </span>
        </label>
        <input
          type="date"
          value={dateOfBirth || todaysDate}
          onChange={(e) =>
            dispatch(changeField({ key: 'dateOfBirth', value: e.target.value }))
          }
          className="border border-gray-300 rounded-md px-2 py-1 w-full text-center tracking-wider bg-white/50 h-12"
        />
      </div>
    </>
  );
}

export default DobStep;
