// TODO: do this component when i have time on my hands.

import { changeSendInvoiceModalStatus } from '@/utils/features/modalStateSlice';
import { formatPrice } from '@/utils/helpers';
import { useAppDispatch } from '@/utils/hooks/rtkhooks';
import { useUser } from '@/utils/useUser';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Database } from 'types_db';

export default function CreateInvoiceAddonModal({
  public_user_id
}: {
  public_user_id: string;
}) {
  const dispatch = useAppDispatch();

  const { user } = useUser();

  const onClose = () => {
    dispatch(changeSendInvoiceModalStatus(false));
  };

  const handleInvoiceSend = async (
    invoice: Database['public']['Tables']['invoice_templates']['Row']
  ) => {
    if (!user) {
      return;
    }

    toast.success('Invoice sent!');
    dispatch(changeSendInvoiceModalStatus(false));
  };

  return (
    <Dialog className="fixed inset-0 z-10" onClose={onClose} open={true}>
      <div className="flex flex-col justify-center h-full px-1 pt-4 text-center sm:block sm:p-0">
        <Dialog.Overlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.4, ease: [0.36, 0.66, 0.04, 1] }
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] }
          }}
          className="fixed inset-0 bg-black/40"
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{
            y: 0,
            transition: { duration: 0.4, ease: [0.36, 0.66, 0.04, 1] }
          }}
          exit={{
            y: '100%',
            transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] }
          }}
          className="z-0 flex flex-col w-full h-full bg-white rounded-t-lg shadow-xl max-w-2xl mx-auto p-2"
        >
          <button
            className="mr-1 mb-6 text-blue-500 focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
          <h1>TODO NOTHING HERE YET</h1>
        </motion.div>
      </div>
    </Dialog>
  );
}
