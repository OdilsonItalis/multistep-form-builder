import React from 'react';
import FormLabel from './FormLabel';

interface TextAreaProps {
  label?: string;
  name?: string;
  placeholder?: string;
}

export default function TextArea({ label, name, placeholder }: TextAreaProps) {
  return (
    <>
      <FormLabel>{label || ''}</FormLabel>
      <textarea
        name={name}
        placeholder={placeholder}
        className="border my-1 border-solid border-gray-200 w-full rounded-md p-2 focus:outline-none text-gray-800"
      />
    </>
  );
}
