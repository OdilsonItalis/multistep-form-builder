import React from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import ArrowSmallLeft from 'public/icons/ArrowSmallLeft';
import { changeField } from '@/utils/features/customFormSlice';
import { getTheme } from '@/utils/getTheme';

function ReusableArrowNavigation({}: {}) {
  const { formConfiguration, step, theme } = useAppSelector(
    (state) => state.customForm
  );
  const dispatch = useAppDispatch();

  const moveDayBack = () => {
    if (step > 0) {
      //   dispatch(changeField({ ));
      dispatch(
        changeField({
          key: 'step',
          value: step - 1
        })
      );
    }
  };
  const hasActionBack = step > 0;

  const { activeColor, inactiveColor } = getTheme(theme);

  return (
    <div className="relative flex h-12 w-full items-center justify-center flex-shrink-0">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={moveDayBack}
        data-testid="moveDayBackButton"
        className={
          !hasActionBack
            ? 'hidden'
            : `absolute left-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${inactiveColor}`
        }
      >
        <ArrowSmallLeft height={18} width={18} strokeWidth={2} />
      </motion.button>

      <div className="flex gap-2">
        {formConfiguration?.map(({ order_number }) => (
          <div
            key={order_number}
            className={`h-[4px] w-10 ${
              step >= order_number - 1 ? activeColor : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ReusableArrowNavigation;
