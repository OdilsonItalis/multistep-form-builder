import { Dialog, Transition } from '@headlessui/react';
import { Addon } from 'pages/create-product';
import CheckIcon from 'public/icons/CheckIcon';
import { Fragment, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

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
  setAddons: React.Dispatch<React.SetStateAction<Addon[]>>;
}

export default function CreateAddonModal({ open, setOpen, setAddons }: Props) {
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

  const onSubmit: SubmitHandler<Inputs> = async (data, event) => {
    const price_in_cents = Math.round(Number(data.price) * 100);
    setAddons((prev) => [
      ...prev,
      {
        order_number: prev.length + 1,
        title: data.title,
        description: data.description,
        price: price_in_cents,
        currency: data.currency,
        multiple_quantity: data.multiple_quantity,
        selected: false,
        quantity: 1
      }
    ]);
    toast.success('Add on created');
    reset({
      title: '',
      description: '',
      price: '',
      currency: 'usd',
      multiple_quantity: false
    });
    handleClose();
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

          <div className="fixed inset-0 overflow-y-auto">
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
                  <button
                    onClick={handleSubmit(onSubmit)}
                    className="text-indigo-600 rounded-lg flex gap-1 h-10 items-center ml-auto"
                  >
                    <CheckIcon height={16} width={16} className="flex-none" />
                    <p>Create Add on</p>
                  </button>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Title of the Add on</span>
                    </label>
                    <input
                      {...register('title', { required: false })}
                      type="text"
                      placeholder="Type here"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <input
                      {...register('description', { required: false })}
                      type="text"
                      placeholder="Type here"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div className="form-control w-full">
                    <div className="flex gap-2">
                      <div className="form-control w-full pb-4">
                        <label className="label">
                          <span className="label-text">Add on cost</span>
                        </label>
                        <input
                          {...register('price', { required: false })}
                          type="number"
                          placeholder="Type here"
                          className="input input-bordered w-full"
                        />
                      </div>
                      <div className="form-control w-full pb-4">
                        <label className="label">
                          <span className="label-text">
                            Choose the currency
                          </span>
                        </label>
                        <select
                          className="select select-bordered w-full mt-auto"
                          {...register('currency', { required: false })}
                        >
                          <option value={'usd'}>$ - US Dollar</option>
                          <option value={'gbp'}>£ - British Pound</option>
                          <option value={'eur'}>€ - Euro</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="form-control w-full">
                    <label className="cursor-pointer label">
                      <span className="label-text">
                        Allow customers to order more than one of this Add on
                      </span>
                      <input
                        type="checkbox"
                        className="toggle"
                        {...register('multiple_quantity')}
                      />
                    </label>
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
