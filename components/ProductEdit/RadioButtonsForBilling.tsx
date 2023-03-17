import { RadioGroup } from '@headlessui/react';
import { motion } from 'framer-motion';

export default function RadioButtonsForBilling({
  billingPeriod,
  setBillingPeriod
}: {
  billingPeriod: 'monthly' | 'yearly' | 'weekly';
  setBillingPeriod: (value: 'monthly' | 'yearly' | 'weekly') => void;
}) {
  return (
    <div className="w-full">
      <RadioGroup
        value={billingPeriod}
        onChange={(value: 'monthly' | 'yearly' | 'weekly') =>
          setBillingPeriod(value)
        }
        className=""
      >
        <div className="mb-2 flex w-full">
          <RadioGroup.Option className="w-full" value="weekly">
            {({ checked }) =>
              checked ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex h-10 w-full items-center justify-center bg-cyan-400 font-semibold text-white"
                >
                  <p>weekly</p>
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex h-10 w-full items-center justify-center border border-gray-300"
                >
                  <p>weekly</p>
                </motion.button>
              )
            }
          </RadioGroup.Option>
          <RadioGroup.Option className="w-full" value="monthly">
            {({ checked }) =>
              checked ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex h-10 w-full items-center justify-center border border-blue-400 bg-cyan-400 font-semibold text-white"
                >
                  <p>monthly</p>
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex h-10 w-full items-center justify-center border border-gray-300"
                >
                  <p>monthly</p>
                </motion.button>
              )
            }
          </RadioGroup.Option>
          <RadioGroup.Option className="w-full" value="yearly">
            {({ checked }) =>
              checked ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex h-10 w-full items-center justify-center border border-blue-400 bg-cyan-400 font-semibold text-white"
                >
                  <p>yearly</p>
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex h-10 w-full items-center justify-center border border-gray-300"
                >
                  <p>yearly</p>
                </motion.button>
              )
            }
          </RadioGroup.Option>
        </div>
      </RadioGroup>
    </div>
  );
}
