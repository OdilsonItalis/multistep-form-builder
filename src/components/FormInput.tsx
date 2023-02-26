import React from 'react';

interface InputProps {
  value: string;
  name?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  id?: string; 
}

export default function FormInput({
  value,
  name,
  onChange,
  type,
  placeholder,
  className,
  id,
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
      className={`border border-solid border-inherit rounded-md py-1 px-2 focus:outline-0 ${className}`}
      {...props}
    />
  );
}
