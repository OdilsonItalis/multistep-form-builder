import CheckoutForm from '@/components/CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

function TestCard() {
  // use axios to fetch client_secret from create-payment-intent api route endpoint

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const getClientSecret = async () => {
    const response = await axios.post('/api/create-payment-intent');
    setClientSecret(response.data.client_secret);
  };

  const options = {
    // passing the client secret obtained in step 3
    clientSecret: clientSecret,
    loader: 'always',
    // Fully customizable with appearance API.
    appearance: {
      theme: 'stripe',

      variables: {
        // colorBackground: 'red',
        // colorPrimary: 'red'
      }
    }
  };

  useEffect(() => {
    getClientSecret();
  }, []);

  if (!clientSecret) return <div>loading...</div>;

  if (options.clientSecret) {
    return (
      <Elements stripe={stripePromise} options={options}>
        <div className="p-2">
          <CheckoutForm />
        </div>
      </Elements>
    );
  }
}

export default TestCard;
