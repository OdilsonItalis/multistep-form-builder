import { RadioGroup } from '@headlessui/react';
import { motion } from 'framer-motion';

export default function PricingButtons({
  pricingState,
  setPricingState
}: {
  pricingState: 'products' | 'subscriptions';
  setPricingState: React.Dispatch<
    React.SetStateAction<'products' | 'subscriptions'>
  >;
}) {
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

  const activeColor = 'bg-indigo-500';
  const inactiveColor = 'bg-indigo-100';

  return (
    <RadioGroup
      value={pricingState}
      onChange={setPricingState}
      className="w-full flex justify-center pb-4"
    >
      <RadioGroup.Option className="" value="products" key="products">
        {({ checked }) => (
          <Button
            checked={checked}
            className={`flex h-8 w-28 items-center justify-center rounded-l-full text-sm ${
              checked ? `${activeColor} text-white` : `${inactiveColor}`
            }`}
          >
            <p className="capitalize">products</p>
          </Button>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option className="" value="subscriptions" key="subscriptions">
        {({ checked }) => (
          <Button
            checked={checked}
            className={`flex h-8 w-28 items-center justify-center rounded-r-full text-sm ${
              checked ? `${activeColor} text-white` : `${inactiveColor}`
            }`}
          >
            <p className="capitalize">Subscriptions</p>
          </Button>
        )}
      </RadioGroup.Option>
    </RadioGroup>
  );
}
