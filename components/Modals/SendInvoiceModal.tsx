import { changeSendInvoiceModalStatus } from '@/utils/features/modalStateSlice';
import { formatPrice } from '@/utils/helpers';
import { useAppDispatch } from '@/utils/hooks/rtkhooks';
import { supabase } from '@/utils/supabase-client';
import { useUser } from '@/utils/useUser';
import { Dialog } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import CheckIcon from 'public/icons/CheckIcon';
import { toast } from 'react-hot-toast';
import { Database } from 'types_db';
import ReadOnlyEditor from '../Editor/ReadOnlyEditor';

export default function SendInvoiceModal({
  public_user_id
}: {
  public_user_id: string;
}) {
  const dispatch = useAppDispatch();

  const { user } = useUser();

  const getInvoiceTemplates = async (userId: string | undefined | null) => {
    let { data, error, count } = await supabase
      .from('invoice_templates')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) {
      throw new Error(`${error.message}: ${error.details}`);
    }
    return { data, count };
  };

  const useGetInvoiceTemplates = (userId: string | undefined | null) => {
    return useQuery({
      queryKey: ['invoices', userId],
      queryFn: () => getInvoiceTemplates(userId),
      enabled: !!userId,
      refetchOnMount: false, // when user invalidates, we don't want to refetch
      refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
    });
  };

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

  const { data, isLoading, error } = useGetInvoiceTemplates(user?.id);

  const onClose = () => {
    dispatch(changeSendInvoiceModalStatus(false));
  };

  const handleInvoiceSend = async (
    invoice: Database['public']['Tables']['invoice_templates']['Row']
  ) => {
    if (!user) {
      return;
    }
    const { data, error } = await supabase.from('invoices').insert({
      created_by: user.id,
      description: invoice.description,
      sent_to: public_user_id,
      currency: invoice.currency,
      unit_amount: invoice.unit_amount,
      title: invoice.title,
      is_paid: false
    });
    if (error) {
      console.log(error);
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
          {data?.data?.map((invoice) => (
            <div
              className="shadow-lg rounded-lg p-2 mb-4 flex flex-col justify-between text-sm ring-1 ring-gray-200 items-baseline gap-2"
              key={invoice.id}
            >
              <div className="flex w-full justify-between items-center pb-2">
                <p className="font-semibold">{invoice.title}</p>
                <button
                  onClick={() => handleInvoiceSend(invoice)}
                  className="bg-black text-white px-2 rounded h-6 text-sm flex items-center gap-1"
                >
                  <CheckIcon color="#FFFFFF" height={12} width={12} />
                  <p>Send</p>
                </button>
              </div>
              <div className="text-sm h-28 text-ellipsis overflow-hidden relative">
                <ReadOnlyEditor instructions={invoice.description || ''} />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white" />
              </div>
              <p className="bg-green-400 rounded-full px-2">
                {formatPrice(invoice?.unit_amount, invoice.currency)}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </Dialog>
  );
}
