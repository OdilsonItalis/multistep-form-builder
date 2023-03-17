import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import CheckIcon from 'public/icons/CheckIcon';
import { useRouter } from 'next/router';
import { useGetPublicUser } from '@/utils/hooks/userHooks';
import { supabase } from '@/utils/supabase-client';
import { useQuery } from '@tanstack/react-query';
import {
  formatPrice,
  formatPriceWithoutCurrency,
  getCurrencySign
} from '@/utils/helpers';
import PricingButtons from './PricingRadioButtons';

import { useGetInvoiceTemplates } from '@/utils/hooks/useGetInvoiceTemplates';
import { useGetProducts } from '@/utils/hooks/useGetProducts';
import OptionalExtrasModal from './Modals/OptionalExtrasModal';
import { Database } from 'types_db';

const frequencies = [
  { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
  { value: 'annually', label: 'Annually', priceSuffix: '/year' }
];
const tiers = [
  {
    name: 'Freelancer',
    id: 'tier-freelancer',
    href: '#',
    price: { monthly: '$15', annually: '$144' },
    description: 'The essentials to provide your best work for clients.',
    features: [
      '5 products',
      'Up to 1,000 subscribers',
      'Basic analytics',
      '48-hour support response time'
    ],
    most_popular: false
  },
  {
    name: 'Startup',
    id: 'tier-startup',
    href: '#',
    price: { monthly: '$30', annually: '$288' },
    description: 'A plan that scales with your rapidly growing business.',
    features: [
      '25 products',
      'Up to 10,000 subscribers',
      'Advanced analytics',
      '24-hour support response time',
      'Marketing automations'
    ],
    most_popular: false
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '#',
    price: { monthly: '$60', annually: '$576' },
    description: 'Dedicated support and infrastructure for your company.',
    features: [
      'Unlimited products',
      'Unlimited subscribers',
      'Advanced analytics',
      '1-hour, dedicated support response time, when you need it',
      'Marketing automations',
      'Custom reporting tools'
    ],
    most_popular: true
  }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function PricingComponent() {
  const [frequency, setFrequency] = useState(frequencies[0]);
  const router = useRouter();
  const { id } = router.query;
  const { data: publicProfile } = useGetPublicUser(id as string | undefined);
  const [loading, setLoading] = useState(false);
  const [addonsModalOpen, setAddonsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    Database['public']['Tables']['invoice_templates']['Row'] | null
  >(null);

  const [pricingState, setPricingState] = useState<
    'products' | 'subscriptions'
  >('products');

  const {
    data: subscriptions,
    isLoading,
    error
  } = useGetProducts(publicProfile?.id);
  const { data: invoiceTemplates } = useGetInvoiceTemplates(publicProfile?.id);

  const handleSelectedProduct = async (
    product: Database['public']['Tables']['invoice_templates']['Row']
  ) => {
    setSelectedProduct(product);
    setAddonsModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center mx-auto max-w-6xl min-h-full">
      <PricingButtons
        pricingState={pricingState}
        setPricingState={setPricingState}
      />
      <div className="isolate flex flex-wrap flex-col sm:flex-row justify-center mt-0 sm:mt-0 gap-2 xl:gap-8 lg:mx-0 pt-2">
        {pricingState === 'products' ? (
          <>
            {invoiceTemplates?.map((product) => (
              <div
                key={product.id}
                className={classNames(
                  product?.value_description === 'most_popular'
                    ? 'ring-2 ring-indigo-600'
                    : 'ring-1 ring-gray-200',
                  'rounded-3xl p-4 xl:p-4 flex flex-col w-72 flex-shrink-0 relative' // reduced padding slightly
                )}
              >
                {product?.value_description === 'most_popular' ? (
                  <p className="rounded-full bg-indigo-200 inset-x-0 w-fit mx-auto justify-center flex flex-grow h-6 items-center px-2.5 -mt-3 text-xs font-semibold leading-5 text-indigo-600 absolute top-0">
                    Most popular
                  </p>
                ) : null}
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={product.id}
                    className={classNames(
                      product?.value_description === 'most_popular'
                        ? 'text-indigo-600'
                        : 'text-gray-900',
                      'text-lg font-semibold leading-8'
                    )}
                  >
                    {product.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {product?.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <RenderPrice
                    currency={product.currency}
                    defaultPrice={product?.unit_amount}
                    // isOfferValid={isOfferValid()}
                    isOfferValid={false}
                  />
                </p>

                <ul
                  role="list"
                  className="mt-4 space-y-2 text-sm leading-6 text-gray-600 pb-6"
                >
                  {product?.features?.map((feature) => (
                    <li key={feature} className="flex gap-x-3 items-center">
                      <CheckIcon
                        height={15}
                        width={15}
                        className="flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelectedProduct(product)}
                  // href={tier.href}
                  // aria-describedby={tier.id}
                  className={classNames(
                    product?.value_description === 'most_popular'
                      ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
                      : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
                    'mt-auto block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  )}
                >
                  Buy plan
                </button>
              </div>
            ))}
          </>
        ) : (
          <>
            {subscriptions?.map((product) => (
              <div
                key={product.id}
                className={classNames(
                  product?.value_description === 'most_popular'
                    ? 'ring-2 ring-indigo-600'
                    : 'ring-1 ring-gray-200',
                  'relative rounded-3xl p-4 xl:p-4 flex flex-col w-72 flex-shrink-0' // reduced padding slightly
                )}
              >
                {product?.value_description === 'most_popular' ? (
                  <p className="rounded-full bg-indigo-200 inset-x-0 w-fit mx-auto justify-center flex flex-grow h-6 items-center px-2.5 -mt-3 text-xs font-semibold leading-5 text-indigo-600 absolute top-0">
                    Most popular
                  </p>
                ) : null}
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={product.id}
                    className={classNames(
                      product?.value_description === 'most_popular'
                        ? 'text-indigo-600'
                        : 'text-gray-900',
                      'text-lg font-semibold leading-8'
                    )}
                  >
                    {product.name}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {product?.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <RenderPrice
                    currency={product.default_price?.currency}
                    defaultPrice={product.default_price?.unit_amount}
                    offerPriceId={product.offer_price_id?.unit_amount}
                    billingInterval={product.default_price?.interval_count}
                    billingPeriod={product.default_price?.interval}
                    // isOfferValid={isOfferValid()}
                    isOfferValid={false}
                  />
                </p>

                <ul
                  role="list"
                  className="mt-4 space-y-2 text-sm leading-6 text-gray-600 pb-6"
                >
                  {product?.features?.map((feature) => (
                    <li key={feature} className="flex gap-x-3 items-center">
                      <CheckIcon
                        height={15}
                        width={15}
                        className="flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  // href={tier.href}
                  // aria-describedby={tier.id}
                  className={classNames(
                    product?.value_description === 'most_popular'
                      ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
                      : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
                    'mt-auto block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  )}
                >
                  Buy plan
                </button>
              </div>
            ))}
          </>
        )}
      </div>
      <OptionalExtrasModal
        open={addonsModalOpen}
        setOpen={setAddonsModalOpen}
        product={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />
    </div>
  );
}

const RenderPrice = ({
  defaultPrice,
  offerPriceId,
  currency,
  billingPeriod,
  billingInterval,
  isOfferValid
}: {
  defaultPrice: number;
  offerPriceId?: number;
  currency: 'usd' | 'gbp' | 'eur';
  billingPeriod?: 'week' | 'month' | 'year';
  billingInterval?: number;
  isOfferValid: boolean;
}) => {
  const currencySign = getCurrencySign(currency);
  return isOfferValid && offerPriceId ? (
    <div className="flex gap-2">
      <p className="line-through decoration-red-600 decoration-2">
        {formatPrice(defaultPrice, currency)}
      </p>
      <div className="flex items-center">
        <p className="text-xs pb-1">{currencySign}</p>
        <p className="font-semibold">
          {formatPriceWithoutCurrency(offerPriceId)}
        </p>
        {billingPeriod && billingInterval ? (
          <p className="text-sm">
            {billingInterval === 1
              ? `/${billingPeriod}`
              : `every ${billingInterval} ${billingPeriod}s`}
          </p>
        ) : null}
      </div>
    </div>
  ) : (
    <div className="flex items-center">
      <p className="text-xs pb-1">{currencySign}</p>
      <p className="font-semibold">
        {formatPriceWithoutCurrency(defaultPrice)}
      </p>
      {billingPeriod && billingInterval ? (
        <p className="text-sm text-gray-400 pl-1">
          {billingInterval === 1
            ? `/${billingPeriod}`
            : `every ${billingInterval} ${billingPeriod}s`}
        </p>
      ) : null}
    </div>
  );
};
