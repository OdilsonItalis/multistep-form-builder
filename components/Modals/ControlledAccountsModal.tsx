// here I just want to figure out how to submit my modal when users press enter on their keyboard, I know its easy on computer, but Im not sure if that trick works with mobile users.

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/utils/useUser';

interface Props {
  isOpen: any;
  handleClose: any;
  selectedDayUid: string;
}

export default function ControlledAccountsModal({
  isOpen,
  handleClose,
  selectedDayUid
}: Props) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={handleClose}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-20" />
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <form className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
                <div className="px-6 py-8">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  >
                    Choose your admin account
                  </Dialog.Title>
                </div>
              </form>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
