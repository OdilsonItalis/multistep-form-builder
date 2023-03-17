import { stripe } from 'utils/stripe';
import { withApiAuth } from '@supabase/auth-helpers-nextjs';
import {
  createOrRetrieveCustomer,
  createOrRetrieveStripeConnectCustomer
} from 'utils/supabase-admin';
import { createClient } from '@supabase/supabase-js';
import { Database } from 'types_db';
import { Addon } from 'pages/create-product';

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default withApiAuth(async function createPaymentIntent(
  req,
  res,
  supabaseServerClient
) {
  if (req.method === 'POST') {
    try {
      const {
        data: { user }
      } = await supabaseServerClient.auth.getUser();
      if (!user) throw Error('Could not get user');

      const {
        productConfig
      }: {
        productConfig: Database['public']['Tables']['invoice_templates']['Row'];
      } = req.body;

      //   get actual product document from supabase
      const { data: invoiceTemplate, error: invoiceError } = await supabaseAdmin
        .from('invoice_templates')
        .select('*')
        .eq('id', productConfig.id)
        .single();

      if (invoiceError) throw Error(invoiceError.message);

      // check that productConfig add_ons pricing is the same as the one in the invoiceTemplate nad that it wasn't tampered with
      const addonsAreValid = () => {
        const selectedAddons = productConfig.add_ons?.filter(
          (addon) => addon.quantity > 0
        );
        if (!selectedAddons) return false;
        const addonsAreValid = selectedAddons.every((addon) => {
          const invoiceTemplateAddon = invoiceTemplate.add_ons?.find(
            (invoiceTemplateAddon) =>
              invoiceTemplateAddon.order_number === addon.order_number
          );
          if (!invoiceTemplateAddon) return false;
          return invoiceTemplateAddon.price === addon.price;
        });
        return addonsAreValid;
      };

      if (!addonsAreValid())
        throw Error("Some addons prices don't match the original document");

      const { data: stripe_account, error: stripeConnectAccountError } =
        await supabaseAdmin
          .from('stripe_connect_accounts')
          .select('*')
          .eq('user_id', invoiceTemplate.user_id)
          .single();

      if (stripeConnectAccountError)
        throw Error(stripeConnectAccountError.message);

      const customer = await createOrRetrieveStripeConnectCustomer({
        uuid: user?.id || '',
        email: user?.email || '',
        // TODO: check why would this be null
        stripeConnectAccountId: stripe_account.stripe_connect_account_id
      });

      const calculateTotalAddonsAmount = () => {
        const selectedAddons = productConfig.add_ons?.filter(
          (addon) => addon.quantity > 0
        );
        if (!selectedAddons) return 0;
        const totalAddonsAmount = selectedAddons.reduce((acc, addon) => {
          return acc + addon.quantity * addon.price;
        }, 0);
        return totalAddonsAmount;
      };

      //   create invoice
      const { data: invoice, error: invoiceCreationError } = await supabaseAdmin
        .from('invoices')
        .insert({
          add_ons: productConfig.add_ons,
          currency: invoiceTemplate.currency,
          unit_amount: invoiceTemplate.unit_amount,
          sent_to: user.id,
          is_paid: false,
          requested_amount:
            invoiceTemplate.unit_amount + calculateTotalAddonsAmount(),
          created_by: invoiceTemplate.user_id
        })
        .select('*')
        .single();

      if (invoiceCreationError) throw Error(invoiceCreationError.message);

      const paymentIntent = await stripe.paymentIntents.create(
        {
          amount: invoiceTemplate.unit_amount + calculateTotalAddonsAmount(),
          currency: invoiceTemplate.currency,
          customer,
          automatic_payment_methods: { enabled: true },
          metadata: {
            invoice_id: invoice.id.toString()
          }
        },
        {
          stripeAccount: stripe_account.stripe_connect_account_id!
        }
      );

      if (!paymentIntent) throw Error('Could not get paymentIntent');

      return res.status(200).json({
        client_secret: paymentIntent.client_secret,
        stripe_connect_account_id: stripe_account.stripe_connect_account_id,
        invoice_id: invoice.id,
        addonsAreValid: addonsAreValid(),
        totalAddonsAmount: calculateTotalAddonsAmount(),
        totalAmount: invoiceTemplate.unit_amount + calculateTotalAddonsAmount(),
        currency: invoiceTemplate.currency
      });
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
});
