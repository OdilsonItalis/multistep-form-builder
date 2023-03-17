import { changeField } from '@/utils/features/customFormSlice';
import { getTheme } from '@/utils/getTheme';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import { RadioGroup } from '@headlessui/react';
import { motion } from 'framer-motion';

export default function SexButtons() {
  const { sex, theme } = useAppSelector((state) => state.customForm);
  const dispatch = useAppDispatch();
  const { activeColor, inactiveColor } = getTheme(theme);
  console.log(activeColor, inactiveColor);

  const Button = ({
    checked,
    className,
    children
  }: {
    checked: boolean;
    className: string;
    children: React.ReactNode;
  }) => (
    <motion.button
      type="button"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.button>
  );

  const handleChange = (value: 'male' | 'female') =>
    dispatch(changeField({ key: 'sex', value }));

  return (
    <div className="form-control w-full ">
      <label className="label">
        <span className="label-text font-semibold">
          What is your sex? <span className="text-red-400">*</span>
        </span>
      </label>
      <RadioGroup value={sex} onChange={handleChange} className="w-full">
        <div className="mb-2 flex w-full gap-1">
          {['male', 'female'].map((value) => (
            <RadioGroup.Option className="w-full" value={value} key={value}>
              {({ checked }) => (
                <Button
                  checked={checked}
                  className={`flex h-10 w-full items-center justify-center ${
                    checked ? `${activeColor} text-white` : `${inactiveColor}`
                  }`}
                >
                  <p className="capitalize">{value}</p>
                </Button>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
