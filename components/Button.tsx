import React, { ReactElement } from 'react';
import { FaChevronRight, FaRegCircle, FaCheckCircle } from 'react-icons/fa';

interface ButtonProps {
  themeColor?: string;
  onClickHandler?: () => void;
  type?: 'button' | 'submit' | 'reset';
  classes?: string;
  children: ReactElement | string;
  leftArrow?: boolean;
  radioCicle?: boolean;
  radioChecked?: boolean;
  disabled?: boolean;
}

export default function Button({
  themeColor,
  onClickHandler,
  type,
  classes,
  children,
  leftArrow,
  radioCicle,
  radioChecked,
  disabled
}: ButtonProps) {
  return (
    <button
      type={type || 'button'}
      className={`rounded-md text-white py-2 px-4 font-medium relative flex items-center justify-center ${classes}`}
      onClick={() => {
        if (onClickHandler) {
          onClickHandler();
        }
      }}
      style={{ background: themeColor || '#000000' }}
      disabled={disabled}
    >
      {radioCicle && (
        <>
          {!radioChecked && (
            <FaRegCircle className="absolute left-[10px] text-[14px]" />
          )}
          {radioChecked && (
            <FaCheckCircle className="absolute left-[10px] text-[14px]" />
          )}
        </>
      )}

      {children}
      {leftArrow && (
        <FaChevronRight className="absolute right-[7px] text-[12px]" />
      )}
    </button>
  );
}
