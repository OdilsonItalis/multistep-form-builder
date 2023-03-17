// TODO: Fix typescript issues
// @ts-nocheck
import {
  calculatePercentageDifference,
  formatPrice,
  formatPriceWithoutCurrency,
  getCurrencySign
} from '@/utils/helpers';
import dayjs from 'dayjs';
import React from 'react';
import { Database } from 'types_db';

const RenderBeforePrice = ({
  price,
  currency
}: {
  price: number;
  currency: 'usd' | 'gbp' | 'eur';
}) => {
  return (
    <p className="line-through decoration-red-600 decoration-2">
      {formatPrice(price, currency)}
    </p>
  );
};

const RenderCurrentPrice = ({
  price,
  currency,
  billingPeriod,
  billingInterval
}: {
  price: number;
  currency: 'usd' | 'gbp' | 'eur';
  billingPeriod: 'week' | 'month' | 'year';
  billingInterval: number;
}) => {
  const currencySign = getCurrencySign(currency);
  return (
    <div className="flex items-center">
      <p className="text-xs pb-1">{currencySign}</p>
      <p className="font-semibold">{formatPriceWithoutCurrency(price)}</p>
      <p className="text-sm">
        {billingInterval === 1
          ? `/${billingPeriod}`
          : `every ${billingInterval} ${billingPeriod}s`}
      </p>
    </div>
  );
};

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
        <p className="text-sm">
          {billingInterval === 1
            ? `/${billingPeriod}`
            : `every ${billingInterval} ${billingPeriod}s`}
        </p>
      ) : null}
    </div>
  );
};

function PartnerProductHit({
  product
}: {
  product: Database['public']['Tables']['products']['Row'];
}) {
  // these are the state values used for the countdown clock
  const [hours, setHours] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);
  // helper function that checks if product.offfer_valid_until is not null and there is time left compared to the current time
  const isOfferValid = () => {
    if (
      product.offer_valid_until &&
      dayjs(product.offer_valid_until).diff(dayjs(), 'second') > 0
    ) {
      return true;
    } else {
      return false;
    }
  };
  const discountPercent = calculatePercentageDifference(
    product.default_price?.unit_amount,
    product.offer_price_id?.unit_amount
  );
  // this function is called every second to update the countdown and the useState values
  const countdown = () => {
    const countdownTime = dayjs(product.offer_valid_until).diff(
      dayjs(),
      'second'
    );
    setHours(Math.floor(countdownTime / 3600));
    setMinutes(Math.floor((countdownTime % 3600) / 60));
    setSeconds(Math.floor(countdownTime % 60));
  };

  //   The countdown function is called immediately when the component renders and then every second afterwards using setInterval.
  React.useEffect(() => {
    countdown();
    const interval = setInterval(() => {
      countdown();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col p-2">
      <p className="font-bold text-2xl h-16">{product.name}</p>
      <div className="flex">
        <div className="flex flex-col flex-shrink-0 pb-2">
          {isOfferValid() && (
            <div className="flex items-center text-red-600 text-sm font-semibold gap-1">
              <div className="bg-red-600 h-6 px-1 flex items-center justify-center text-white">
                <p>{discountPercent}% off</p>
              </div>
              <p className="">Ends in</p>
              <span className="countdown font-mono">
                <span style={{ '--value': hours }}></span>:
                <span style={{ '--value': minutes }}></span>:
                <span style={{ '--value': seconds }}></span>
              </span>
            </div>
          )}
          {/* <div className="flex items-center gap-2">
            <RenderBeforePrice
              currency={product.default_price?.currency}
              price={product.default_price?.unit_amount}
            />
            <RenderCurrentPrice
              billingInterval={product.offer_price_id?.interval_count}
              billingPeriod={product.offer_price_id?.interval}
              currency={product.offer_price_id?.currency}
              price={product.offer_price_id?.unit_amount}
            />
          </div> */}
          <RenderPrice
            currency={product.default_price?.currency}
            defaultPrice={product.default_price?.unit_amount}
            offerPriceId={product.offer_price_id?.unit_amount}
            billingInterval={product.default_price?.interval_count}
            billingPeriod={product.default_price?.interval}
            isOfferValid={isOfferValid()}
          />
        </div>
      </div>
      {/* <p className="prose font-sans w-full">{product?.description}</p> */}
      <div>
        <pre className="whitespace-pre-wrap font-sans">
          {product.description}
        </pre>
      </div>
    </div>
  );
}

export default PartnerProductHit;
