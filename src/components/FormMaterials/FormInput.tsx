import React from 'react';

import { InputProps } from '../../models/componentsMaterialModels';
import FormLabel from './FormLabel';

export default function FormInput({
  value,
  name,
  onChange,
  type,
  placeholder,
  className,
  id,
  error,
  label,
  ...props
}: InputProps) {
  return (
    <>
      <FormLabel>{label || ''}</FormLabel>
      <input
        value={value}
        name={name}
        id={id}
        type={type || 'text'}
        placeholder={placeholder}
        onChange={onChange}
        className={`border h-[40px] border-solid text-gray-800 border-inherit rounded-md py-1 px-2 focus:outline-0 ${className} ${
          error && 'border-red-500'
        }`}
        {...props}
      />
    </>
  );
}
