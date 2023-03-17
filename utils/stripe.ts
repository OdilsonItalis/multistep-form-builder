import Stripe from 'stripe';

// export const stripe = new Stripe(
//   process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? '',
//   {
//     // https://github.com/stripe/stripe-node#configuration
//     apiVersion: '2020-08-27',
//     // Register this as an official Stripe plugin.
//     // https://stripe.com/docs/building-plugins#setappinfo
//     appInfo: {
//       name: 'Next.js Subscription Starter',
//       version: '0.1.0'
//     }
//   }
// );

export const stripe = new Stripe(
  'sk_test_51MSetGCM9ezwNkwCA3U97aCk2sx3PEXMKxoTxb5rfxDmcFhuPKOXOaneM88MVBcEqlsr7pDkgUrOxioy5SOVOakX00TU8WEW1l',
  {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2020-08-27',
    // Register this as an official Stripe plugin.
    // https://stripe.com/docs/building-plugins#setappinfo
    appInfo: {
      name: 'Next.js Subscription Starter',
      version: '0.1.0'
    }
  }
);
