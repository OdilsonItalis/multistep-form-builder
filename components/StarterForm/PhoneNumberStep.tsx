import React, { useState } from 'react';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import { changeField } from '@/utils/features/customFormSlice';

function PhoneNumberStep() {
  const [value, setValue] = useState();
  const { unitSystem, phoneNumber } = useAppSelector(
    (state) => state.customForm
  );
  const dispatch = useAppDispatch();
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-semibold">
          What is your date of birth? <span className="text-red-400">*</span>
        </span>
      </label>
      <div className="bg-white/50">
        <PhoneInput
          placeholder="Enter phone number"
          value={phoneNumber || ''}
          className="h-12 flex flex-shrink-0 px-2 border"
          onChange={(e) =>
            dispatch(changeField({ key: 'phoneNumber', value: e }))
          }
        />
      </div>
    </div>
  );
}

export default PhoneNumberStep;
