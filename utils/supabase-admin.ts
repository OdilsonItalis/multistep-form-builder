import { createClient } from '@supabase/supabase-js';
import { stripe } from './stripe';
import { toDateTime } from './helpers';
import { Price, Product } from 'types';
import type { Database } from 'types_db';
import Stripe from 'stripe';

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const upsertProductRecord = async (product: Stripe.Product) => {
  // here for stripe connect users I am adding price from the front end, so I don't want to repeat, therefore I am checking for metadata if its stripe connect related
  if (product.metadata?.stripe_connect) return;
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? undefined,
    image: product.images?.[0] ?? null,
    metadata: product.metadata
  };

  const { error } = await supabaseAdmin.from('products').upsert([productData]);
  if (error) throw error;
  console.log(`Product inserted/updated: ${product.id}`);
};

// Testing stripe connect logic

const logStripeConnectEvent = async (event: Stripe.Event) => {
  const eventData = {
    id: event.id,
    type: event.type,
    created: toDateTime(event.created),
    data: event.data,
    livemode: event.livemode,
    object: event.object,
    pending_webhooks: event.pending_webhooks,
    request: event.request,
    api_version: event.api_version
  };

  const { error } = await supabaseAdmin.from('stripe_connect_events').insert({
    // @ts-ignore
    event_object: event,
    type: event.type
  });
  if (error) throw error;
  console.log(`Event logged: ${event.id}`);
};

const upsertPriceRecord = async (price: Stripe.Price) => {
  // here for stripe connect users I am adding price from the front end, so I don't want to repeat, therefore I am checking for metadata if its stripe connect related
  if (price.metadata?.stripe_connect) return;
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : '',
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? undefined,
    type: price.type,
    unit_amount: price.unit_amount ?? undefined,
    interval: price.recurring?.interval,
    interval_count: price.recurring?.interval_count,
    trial_period_days: price.recurring?.trial_period_days,
    metadata: price.metadata
  };

  const { error } = await supabaseAdmin.from('prices').upsert([priceData]);
  if (error) throw error;
  console.log(`Price inserted/updated: ${price.id}`);
};

const createOrRetrieveCustomer = async ({
  email,
  uuid
}: {
  email: string;
  uuid: string;
}) => {
  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', uuid)
    .single();
  if (error || !data?.stripe_customer_id) {
    // No customer record found, let's create one.
    const customerData: {
      name: string;
      metadata: { supabaseUUID: string };
      email?: string;
    } = {
      name: uuid,
      metadata: {
        supabaseUUID: uuid
      }
    };
    if (email) customerData.email = email;
    const customer = await stripe.customers.create(customerData);
    // Now insert the customer ID into our Supabase mapping table.
    const { error: supabaseError } = await supabaseAdmin
      .from('customers')
      .insert([{ id: uuid, stripe_customer_id: customer.id }]);
    if (supabaseError) throw supabaseError;
    console.log(`New customer created and inserted for ${uuid}.`);
    return customer.id;
  }
  return data.stripe_customer_id;
};

const createOrRetrieveStripeConnectCustomer = async ({
  email,
  uuid,
  stripeConnectAccountId
}: {
  email: string;
  uuid: string;
  stripeConnectAccountId: string;
}) => {
  const { data, error } = await supabaseAdmin
    .from('stripe_connect_customers')
    .select('*')
    .eq('id', uuid)
    .eq('stripe_connect_account_id', stripeConnectAccountId)
    .single();

  if (error || !data?.stripe_customer_id) {
    // No customer record found, let's create one.
    const customerData: {
      name: string;
      metadata: { supabaseUUID: string };
      email?: string;
    } = {
      name: uuid,
      metadata: {
        supabaseUUID: uuid
      }
    };
    if (email) customerData.email = email;
    const customer = await stripe.customers.create(customerData, {
      stripeAccount: stripeConnectAccountId
    });
    // Now insert the customer ID into our Supabase mapping table.
    const { error: supabaseError } = await supabaseAdmin
      .from('stripe_connect_customers')
      .insert([
        {
          id: uuid,
          stripe_customer_id: customer.id,
          stripe_connect_account_id: stripeConnectAccountId
        }
      ]);
    if (supabaseError) throw supabaseError;
    console.log(`New customer created and inserted for ${uuid}.`);
    return customer.id;
  }
  return data.stripe_customer_id;
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod,
  stripeConnectAccountId?: string
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  const stripeConnectAccountOptions = stripeConnectAccountId
    ? { stripeAccount: stripeConnectAccountId }
    : {};
  await stripe.customers.update(
    customer,
    //@ts-ignore
    { name, phone, address },
    stripeConnectAccountOptions
  );

  const { error } = await supabaseAdmin
    .from('users')
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] }
    })
    .eq('id', uuid);
  if (error) throw error;
};

// This is for stripe connect subscription management
const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false,
  stripeConnectAccountId?: string
) => {
  // Get customer's UUID from mapping table.
  const tableName = stripeConnectAccountId
    ? 'stripe_connect_customers'
    : 'customers';
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from(tableName)
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  console.log({
    subscriptionId,
    customerId,
    createAction,
    stripeConnectAccountId,
    tableName,
    customerData,
    noCustomerError
  });

  if (noCustomerError) throw noCustomerError;
  if (noCustomerError) console.log('there was no customer error here');

  const { id: uuid } = customerData!;

  const stripeConnectAccountOptions = stripeConnectAccountId
    ? { stripeAccount: stripeConnectAccountId }
    : {};

  const subscription = await stripe.subscriptions.retrieve(
    subscriptionId,
    {
      expand: ['default_payment_method']
    },
    stripeConnectAccountOptions
  );

  // Upsert the latest status of the subscription object.
  const subscriptionData: Database['public']['Tables']['subscriptions']['Insert'] =
    {
      id: subscription.id,
      user_id: uuid,
      metadata: subscription.metadata,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      product_id: subscription.items.data[0].price.product,
      //TODO check quantity on subscription
      // @ts-ignore
      quantity: subscription.quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at
        ? toDateTime(subscription.cancel_at).toISOString()
        : null,
      canceled_at: subscription.canceled_at
        ? toDateTime(subscription.canceled_at).toISOString()
        : null,
      current_period_start: toDateTime(
        subscription.current_period_start
      ).toISOString(),
      current_period_end: toDateTime(
        subscription.current_period_end
      ).toISOString(),
      created: toDateTime(subscription.created).toISOString(),
      ended_at: subscription.ended_at
        ? toDateTime(subscription.ended_at).toISOString()
        : null,
      trial_start: subscription.trial_start
        ? toDateTime(subscription.trial_start).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? toDateTime(subscription.trial_end).toISOString()
        : null,
      ...(subscription.metadata?.subscribed_to && {
        subscribed_to: subscription.metadata?.subscribed_to,
        stripe_connect_subscription: true
      })
    };

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData]);
  if (error) throw error;
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
  );
  if (subscription.metadata?.premium_access === 'true') {
    // here I update the premium members table with subscription status
    const { error: premium_members_upsert_error } = await supabaseAdmin
      .from('premium_members')
      .upsert({
        user_id: uuid,
        subscription_status: subscription.status,
        source: 'stripe',
        expires_at: toDateTime(subscription.current_period_end).toISOString(),
        price_id: subscription.items.data[0].price.id,
        // here if the user was referred by someone, I store the referred_by id and then potentially track the referred_by user's earnings
        ...(subscription.metadata?.referred_by && {
          referred_by: subscription.metadata.referred_by
        })
      });
    if (premium_members_upsert_error) throw error;
    console.log(`Inserted/updated premium_members table for user [${uuid}]`);
  }

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod,
      stripeConnectAccountId
    );
};

const insertCharge = async (object: Stripe.Charge) => {
  if (object.metadata?.invoice_id) {
    // convert invoice id to number
    const invoice_id = parseInt(object.metadata?.invoice_id);
    const { error } = await supabaseAdmin
      .from('invoices')
      .update({
        paid_at: toDateTime(object.created).toISOString(),
        is_paid: true
      })
      .eq('id', invoice_id);
    if (error) throw error;
  }
  return;
};

export {
  upsertProductRecord,
  upsertPriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  insertCharge,
  logStripeConnectEvent,
  createOrRetrieveStripeConnectCustomer
};
