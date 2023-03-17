import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import { toast, Toaster } from 'react-hot-toast';

function CreateStripePartnerAccount() {
  const router = useRouter();
  const handleAccountCreation = async () => {
    toast.loading('Loading...');
    try {
      const res = await axios.post(`/api/create-stripe-connect-account`);
      const { accountLinkUrl } = res.data;
      router.push(accountLinkUrl);
      toast.dismiss();
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error('Something went wrong, check console');
    }
  };
  const handleAccountDeletion = async () => {
    toast.loading('Loading...');
    try {
      const res = await axios.post(`/api/delete-stripe-connect-account`);
      console.log(res);
      toast.dismiss();
      toast.success('Account has been deleted');
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error('Something went wrong, check console');
    }
  };
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-sky-500/30 to-indigo-500/30">
      <Toaster />
      <h1 className="font-semibold text-2xl text-center absolute pt-12 top-0">
        Get 100% of you online fitness business profits and start making passive
        income
      </h1>
      <button onClick={handleAccountCreation} className="btn">
        Click here to get started
      </button>
      {/* <button onClick={handleAccountDeletion} className="btn">
        delete this account
      </button> */}
    </div>
  );
}

export default CreateStripePartnerAccount;
