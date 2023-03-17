import AppBarBackUniversal from '@/components/Navigation/AppBarBackUniversal';
import { formatPrice } from '@/utils/helpers';
import { supabase } from '@/utils/supabase-client';
import { useUser } from '@/utils/useUser';
import { useQueryClient } from '@tanstack/react-query';
import ArrowSmallDown from 'public/icons/ArrowSmallDown';
import ArrowSmallUp from 'public/icons/ArrowSmallUp';
import CheckIcon from 'public/icons/CheckIcon';
import React from 'react';
import { useGetInvoiceTemplates } from '@/utils/hooks/useGetInvoiceTemplates';
import { toast } from 'react-hot-toast';

function MyForms() {
  const { user } = useUser();

  // TODO: Convert this to delete function

  //   const handleArchive = async () => {
  //     const { data, error } = await supabase
  //       .from('leads')
  //       .update({ status: 'archived' })
  //       .eq('id', '1');
  //     if (error) {
  //       throw new Error(`${error.message}: ${error.details}`);
  //     }
  //   };

  const { data: products, isLoading, error } = useGetInvoiceTemplates(user?.id);

  const queryClient = useQueryClient();

  function moveUp(productId: number) {
    if (!products) return;
    let index = products.findIndex((e) => e.id == productId);
    if (index > 0) {
      let newProducts = [...products];
      let el = newProducts[index];
      newProducts[index] = newProducts[index - 1];
      newProducts[index - 1] = el;
      queryClient.setQueryData(['invoiceTemplates', user?.id], newProducts);
    }
  }

  function moveDown(productId: number) {
    if (!products) return;
    let index = products.findIndex((e) => e.id == productId);
    if (index < products.length - 1) {
      let newProducts = [...products];
      let el = newProducts[index];
      newProducts[index] = newProducts[index + 1];
      newProducts[index + 1] = el;
      queryClient.setQueryData(['invoiceTemplates', user?.id], newProducts);
    }
  }

  const saveChanges = async () => {
    if (!products) return;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const { error } = await supabase
        .from('invoice_templates')
        .update({ order_number: i })
        .eq('id', product.id);
      if (error) {
        toast.error(error.message);
        return;
      }
    }

    toast.success('All updates have succeeded!');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex">
        <AppBarBackUniversal />
        <button
          onClick={saveChanges}
          className="flex ml-auto items-center gap-1 text-blue-500"
        >
          <CheckIcon height={15} width={15} />
          <p>Save</p>
        </button>
      </div>
      {products?.map((invoice, index) => (
        <div className="flex w-full">
          <div
            className="shadow-lg rounded-lg p-2 mb-4 flex flex-col justify-between text-sm ring-1 ring-gray-200 items-baseline gap-2 w-full"
            // key={lead.id}
          >
            <p className="font-semibold">{invoice.title}</p>
            <p>{invoice.description}</p>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white" />
            <div className="flex flex-col items-center justify-center w-full">
              {invoice.features?.map((benefit) => {
                return (
                  <div className="flex w-full gap-2 items-center justify-start">
                    <CheckIcon
                      height={15}
                      width={15}
                      className="flex-none text-indigo-600"
                      aria-hidden="true"
                    />
                    <p className="text-sm text-left">{benefit}</p>
                  </div>
                );
              })}
            </div>
            <p className="bg-green-400 rounded-full px-2">
              {formatPrice(invoice?.unit_amount, invoice.currency)}
            </p>
          </div>
          <div className="flex flex-col">
            {index !== 0 && (
              <button
                onClick={() => moveUp(invoice.id)}
                className="flex items-center justify-center w-10 h-10"
              >
                <ArrowSmallUp height={20} width={20} />
              </button>
            )}
            {index !== products.length - 1 && (
              <button
                onClick={() => moveDown(invoice.id)}
                className="flex items-center justify-center w-10 h-10"
              >
                <ArrowSmallDown height={20} width={20} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyForms;
