import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

// export const getStripe = () => {
//   if (!stripePromise) {
//     stripePromise = loadStripe(
//       process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ?? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
//     );
//   }

//   return stripePromise;
// };

// Change this to LIVE!!!!!
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe('pk_test_3dpg61yWZaUfCf6btHRrx59y');
  }

  return stripePromise;
};
