import React from 'react';
import { motion } from 'framer-motion';
import { FaChevronRight, FaRegCircle, FaCheckCircle } from 'react-icons/fa';

import { ButtonProps } from '@/models/componentsMaterialModels';

export default function Button({
  themeColor,
  onClickHandler,
  type,
  classes,
  children,
  leftArrow,
  radioCicle,
  radioChecked,
  disabled,
  customBgColor
}: ButtonProps) {
  return (
    <motion.button
      type={type || 'button'}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        if (onClickHandler) {
          onClickHandler();
        }
      }}
      style={!customBgColor ? { background: themeColor || '#000000' } : {}}
      disabled={disabled}
      className={`rounded-md text-white h-[45px] py-2 px-4 font-medium relative flex items-center justify-center hover:opacity-80 duration-[0.2s] ${classes}`}
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
    </motion.button>
  );
}
