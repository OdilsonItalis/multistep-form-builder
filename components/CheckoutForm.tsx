import React, { useEffect, useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement
} from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isStripLoading, setIsStripLoading] = useState(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    toast.loading('Processing payment...');

    const { error, paymentIntent } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: 'http://localhost:3000/test-return'
      }
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      toast.dismiss();
      toast.error(error.message!);
      setErrorMessage(error.message!);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.

      // The PaymentIntent can be confirmed again on the server with a
      // `payment_intent_id` and `payment_intent_client_secret`.
      if (paymentIntent?.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
        toast.dismiss();
        toast.success('Payment successful!');
      }
    }
  };

  useEffect(() => {
    if (elements) {
      const element = elements.getElement('payment');
      element?.on('ready', () => {
        setIsStripLoading(false);
      });
    }
  }, [elements]);

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <PaymentElement />
      {
        // Show a spinner or placeholder content while Stripe.js is loading
        isStripLoading ? (
          <div>Stripe is loading...</div>
        ) : (
          <>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 my-4  px-4 rounded"
              disabled={!stripe}
            >
              Submit
            </button>
            <img src="/stripe-badge-transparent.png" alt="" className="w-1/3" />
          </>
        )
      }
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default CheckoutForm;
