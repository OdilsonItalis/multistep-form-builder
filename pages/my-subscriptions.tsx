import AppBarBackUniversal from '@/components/Navigation/AppBarBackUniversal';
import { formatPrice } from '@/utils/helpers';
import { supabase } from '@/utils/supabase-client';
import { useUser } from '@/utils/useUser';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import ArrowSmallDown from 'public/icons/ArrowSmallDown';
import ArrowSmallUp from 'public/icons/ArrowSmallUp';
import CheckIcon from 'public/icons/CheckIcon';
import PlusIcon from 'public/icons/PlusIcon';
import React from 'react';
import { toast, Toaster } from 'react-hot-toast';

function MySubscriptions() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  // again don't know why this would be null, even though its required in supabase table
  const getProducts = async (userId: string | undefined | null) => {
    let {
      data: products,
      error,
      count
    } = await supabase
      .from('products')
      .select('*, default_price (*), offer_price_id (*)')
      .eq('created_by', userId)
      .order('order_number', { ascending: true });
    if (error) {
      throw new Error(`${error.message}: ${error.details}`);
    }
    if (count === 0) {
      return null;
    }
    if (!products) return null;
    if (products) {
      // @ts-ignore TODO: need to find how to handle this with supabase
      //   setSelectedPrice(products[0].default_price.id);
      return products;
    }
  };

  function useGetProducts(userId: string | undefined | null) {
    return useQuery({
      queryKey: ['products', userId],
      queryFn: () => getProducts(userId),
      enabled: !!userId,
      refetchOnMount: false, // when user invalidates, we don't want to refetch
      refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
    });
  }

  const router = useRouter();

  const handleAddNewProduct = () => {
    router.push('/create-product');
  };
  const handleProductEdit = (id: string) => {
    router.push(`/edit-product/${id}`);
  };

  const { data: products, error } = useGetProducts(user?.id);

  const saveChanges = async () => {
    if (!products) return;
    toast.loading('Saving changes...');
    try {
      const res = await axios.post('/api/reorder-subscriptions', {
        products
      });
      toast.dismiss();
      toast.success('Changes saved');
      console.log(res);
    } catch (error) {
      toast.dismiss();
      toast.error('Something went wrong');
    }
  };

  function moveUp(productId: string) {
    if (!products) return;
    let index = products.findIndex((e) => e.id == productId);
    if (index > 0) {
      let newProducts = [...products];
      let el = newProducts[index];
      newProducts[index] = newProducts[index - 1];
      newProducts[index - 1] = el;
      queryClient.setQueryData(['products', user?.id], newProducts);
    }
  }

  function moveDown(productId: string) {
    if (!products) return;
    let index = products.findIndex((e) => e.id == productId);
    if (index < products.length - 1) {
      let newProducts = [...products];
      let el = newProducts[index];
      newProducts[index] = newProducts[index + 1];
      newProducts[index + 1] = el;
      queryClient.setQueryData(['products', user?.id], newProducts);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center">
        <AppBarBackUniversal />
        <button
          onClick={saveChanges}
          className="flex ml-auto items-center px-4 gap-1 text-blue-500"
        >
          <CheckIcon height={15} width={15} />
          <p>Save</p>
        </button>
      </div>
      <div className="flex flex-col px-2">
        <div className="flex flex-col gap-4">
          {products?.map((product, index) => (
            <div className="flex w-full">
              <div
                className="ring-1 ring-gray-200 shadow p-2 rounded-lg w-full"
                key={product.id}
                onClick={() => handleProductEdit(product.id)}
              >
                <p className="font-semibold">{product.name}</p>
                <p>{product.description}</p>
                <p>
                  {formatPrice(
                    product.default_price.unit_amount,
                    product.default_price.currency
                  )}
                </p>
                <div className="flex flex-col items-center justify-center w-full">
                  {product.features &&
                    product.features.map((benefit) => {
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
              </div>
              <div className="flex flex-col pl-2">
                {index !== 0 && (
                  <button
                    onClick={() => moveUp(product.id)}
                    className="flex items-center justify-center w-10 h-10 hover:bg-gray-200 rounded-full"
                  >
                    <ArrowSmallUp height={20} width={20} />
                  </button>
                )}
                {index !== products.length - 1 && (
                  <button
                    onClick={() => moveDown(product.id)}
                    className="flex items-center justify-center w-10 h-10 hover:bg-gray-200 rounded-full"
                  >
                    <ArrowSmallDown height={20} width={20} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleAddNewProduct}
          className="flex w-48 h-10 justify-center gap-2 items-center border rounded mt-4 shadow"
        >
          <PlusIcon height={20} width={20} />
          <p>Add New Product</p>
        </button>
      </div>
    </div>
  );
}

export default MySubscriptions;
