import React, { ReactElement } from 'react';
import { FaChevronRight, FaRegCircle, FaCheckCircle } from 'react-icons/fa';

import { ButtonProps } from '../../models/componentsMaterialModels';

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
      className={`rounded-md text-white py-2 px-4 font-medium relative flex items-center justify-center hover:opacity-80 duration-[0.2s] ${classes}`}
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
