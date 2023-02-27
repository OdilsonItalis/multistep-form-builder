import React from 'react';

import { InputProps } from '../../models/componentsMaterialModels';

export default function FormInput({
  value,
  name,
  onChange,
  type,
  placeholder,
  className,
  id,
  error,
  ...props
}: InputProps) {
  return (
    <input
      value={value}
      name={name}
      id={id}
      type={type || 'text'}
      placeholder={placeholder}
      onChange={onChange}
      className={`border border-solid border-inherit rounded-md py-1 px-2 focus:outline-0 ${className} ${
        error && 'border-red-500'
      }`}
      {...props}
    />
  );
}
