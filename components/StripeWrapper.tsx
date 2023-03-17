import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import { Stripe } from '@stripe/stripe-js';

function StripeWrapper({
  accountId,
  children,
  clientSecret
}: {
  accountId: string;
  children: React.ReactNode;
  clientSecret: string;
}) {
  const [stripeObject, setStripeObject] = useState<Stripe | null>(null);

  const options = {
    // passing the client secret obtained in step 3
    clientSecret: clientSecret,
    loader: 'always',
    // Fully customizable with appearance API.
    appearance: {
      theme: 'stripe' as const
    }
  };

  // This function will re-run if the accountId prop changes.
  useEffect(() => {
    const fetchStripeObject = async () => {
      // If there is no accountId, do not run the loadStripe function.
      if (accountId) {
        const res = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ??
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
            '',
          {
            stripeAccount: accountId
          }
        );
        // When we have got the Stripe object, pass it into our useState.
        setStripeObject(res);
      }
    };
    fetchStripeObject();
  }, [accountId]);

  // If no Stripe object, do not render the Stripe Element.
  if (!stripeObject || !clientSecret) {
    return <p>Loading...</p>;
  }

  // Once we have the Stripe object, load everything.
  return (
    <Elements options={options} stripe={stripeObject}>
      {children}
    </Elements>
  );
}

export default StripeWrapper;
