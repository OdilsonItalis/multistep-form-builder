import CheckoutForm from '@/components/CheckoutForm';
import PaymentStatusHandler from '@/components/PaymentStatusHandler';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

function TestReturn() {
  return (
    <Elements stripe={stripePromise}>
      <div className="p-2">
        <PaymentStatusHandler />
      </div>
    </Elements>
  );
}

export default TestReturn;
