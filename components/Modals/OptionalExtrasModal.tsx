import { formatPriceWithoutCurrency, getCurrencySign } from '@/utils/helpers';
import { Dialog, Transition } from '@headlessui/react';
import {
  ChevronRightIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Addon } from 'pages/create-product';
import { Fragment, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Database } from 'types_db';

interface Inputs {
  description: string;
  price: string;
  currency: 'usd' | 'gbp' | 'eur';
  title: string;
  multiple_quantity: boolean;
}

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  product: Database['public']['Tables']['invoice_templates']['Row'] | null;
  setSelectedProduct: React.Dispatch<
    React.SetStateAction<
      Database['public']['Tables']['invoice_templates']['Row'] | null
    >
  >;
}

export default function OptionalExtrasModal({
  open,
  setOpen,
  product,
  setSelectedProduct
}: Props) {
  const handleClose = () => {
    setOpen(false);
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<Inputs>();

  const decreaseQuantity = (addon: Addon) => {
    // check if selectedProduct and selected add on is 1 or more and if so, decrease by 1
    if (product && product.add_ons && addon.quantity > 0) {
      const updatedAddons = product.add_ons.map((a) => {
        if (a.order_number === addon.order_number) {
          return { ...a, quantity: a.quantity - 1 };
        }
        return a;
      });

      setSelectedProduct({
        ...product,
        add_ons: updatedAddons
      });
    }
  };

  const increaseQuantity = (addon: Addon) => {
    if (product && product.add_ons) {
      const updatedAddons = product.add_ons.map((a) => {
        if (a.order_number === addon.order_number) {
          return { ...a, quantity: a.quantity + 1 };
        }
        return a;
      });

      setSelectedProduct({
        ...product,
        add_ons: updatedAddons
      });
    }
  };

  // function that takes the base price and sums up the total price of all the add ons
  const getTotalPrice = () => {
    const basePrice = product?.unit_amount || 0;
    if (product?.add_ons) {
      const addonsTotal = product.add_ons.reduce((acc, addon) => {
        return acc + addon.price * addon.quantity;
      }, 0);
      return basePrice + addonsTotal;
    }
    return basePrice;
  };

  const onSubmit: SubmitHandler<Inputs> = async (data, event) => {
    // const price_in_cents = Math.round(Number(data.price) * 100);
    console.log(product);

    // handleClose();
  };

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto max-w-xl mx-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col gap-2 py-2">
                    <h1 className="font-semibold text-xl mx-auto pb-4">
                      Select your extras
                    </h1>
                    {product?.add_ons?.map((addon) => {
                      return (
                        <div className="flex flex-col justify-between border p-2 rounded-lg">
                          <div className="flex items-center">
                            <p className="font-bold">{addon.title}</p>
                            <div className="flex ml-auto">
                              <p className="text-xs pb-1">
                                {getCurrencySign(addon.currency)}
                              </p>
                              <p className="font-semibold text-sm">
                                {formatPriceWithoutCurrency(addon.price)}
                              </p>
                            </div>
                            {/* <button className="flex ml-auto items-center justify-center gap-1 px-4 text-sm h-8 bg-green-200 text-green-800 rounded-full">
                              <CheckIcon height={16} width={16} />
                              <p>add</p>
                            </button>

                            <button className="flex items-center justify-center h-8 w-8 text-red-600 rounded-full hover:bg-red-200">
                              <ExitIcon height={16} width={16} />
                            </button> */}
                          </div>
                          <p className="text-sm text-gray-400">
                            {addon.description}
                          </p>
                          <div className="flex items-center pt-4">
                            <button
                              onClick={() => decreaseQuantity(addon)}
                              className="flex justify-center items-center border rounded-full h-8 w-8 flex-shrink-0"
                            >
                              <MinusIcon height={16} width={16} />
                            </button>
                            <p className="flex items-center justify-center w-8 h-8">
                              {addon.quantity}
                            </p>
                            <button
                              onClick={() => increaseQuantity(addon)}
                              className="flex justify-center items-center border rounded-full h-8 w-8 flex-shrink-0"
                            >
                              <PlusIcon height={16} width={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex items-center gap-1 ml-auto">
                      <p className="text-sm text-gray-500">Total to pay:</p>
                      <p className="font-semibold text-sm">
                        {formatPriceWithoutCurrency(getTotalPrice())}
                      </p>
                    </div>
                    <button
                      onClick={handleSubmit(onSubmit)}
                      className="text-white rounded-lg flex gap-2 h-10 items-center bg-indigo-500 justify-center relative"
                    >
                      <p>Continue</p>
                      <ChevronRightIcon
                        height={16}
                        width={16}
                        className="absolute right-4"
                      />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
