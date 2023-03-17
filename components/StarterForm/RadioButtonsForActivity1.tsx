import { RadioGroup } from '@headlessui/react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import { changeField } from '@/utils/features/customFormSlice';
import { useRouter } from 'next/router';
import { useGetPublicUser } from '@/utils/hooks/userHooks';
import { getTheme } from '@/utils/getTheme';

const radioButtons = [
  {
    value: 'sedentary',
    label: 'Not Very active',
    description: 'Spend most of the day sitting (desk job)'
  },
  {
    value: 'lightlyActive',
    label: 'Lightly active',
    description: 'Spend good part of your day on your feet (eg. teacher)'
  },
  {
    value: 'active',
    label: 'Active',
    description:
      'Spend a good part of the day doing some physical activity (e.g. food server)'
  },
  {
    value: 'veryActive',
    label: 'Very Active',
    description:
      'Spend most of the day doing heavy physical activity (e.g. bike messenger, carpenter)'
  }
];

export default function RadioButtonsForActivity1() {
  const { activity, theme } = useAppSelector((state) => state.customForm);
  const dispatch = useAppDispatch();
  const { activeColor, inactiveColor } = getTheme(theme);

  return (
    <>
      <RadioGroup
        value={activity}
        onChange={(
          value: 'sedentary' | 'lightlyActive' | 'active' | 'veryActive' | null
        ) => {
          dispatch(
            changeField({
              key: 'activity',
              value
            })
          );
        }}
        className="mb-2"
      >
        <div className="flex w-full flex-col gap-2">
          {radioButtons.map(({ value, label, description }) => (
            <RadioGroup.Option className="w-full" value={value} key={value}>
              {({ checked }) => (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex flex-col justify-between h-20 w-full p-2 ${
                    checked
                      ? `text-white border ${activeColor}`
                      : `${inactiveColor}`
                  }`}
                >
                  <p className="font-semibold">{label}</p>
                  <p className="flex text-sm text-left">{description}</p>
                </motion.button>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </>
  );
}
