import * as React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAppDispatch } from '@/utils/hooks/rtkhooks';
import { useUser } from '@/utils/useUser';
import { SubmitHandler, useForm } from 'react-hook-form';
import AppBarBackUniversal from '@/components/Navigation/AppBarBackUniversal';
import { supabase } from '@/utils/supabase-client';

interface FormValues {
  email: string;
  password: string;
}

export default function AuthModal() {
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const supabaseClient = useSupabaseClient();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { data: passowrdupdateData, error } =
      await supabaseClient.auth.updateUser({
        password: data.password
      });
    if (error) {
      toast.error(error.message);
      return;
    }
    if (passowrdupdateData) alert('Password updated successfully!');
  };

  return (
    <div>
      <Toaster />
      <AppBarBackUniversal />
      <div className="flex flex-col justify-center h-full px-1 pt-4 text-center sm:block sm:p-0 max-w-md mx-auto items-center">
        <h1 className="font-semibold p-4">Enter your new password</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-2"
        >
          <input
            type="email"
            placeholder="Email"
            {...register('email')}
            className="input input-bordered w-full"
          />
          <input
            type="password"
            placeholder="Password"
            {...register('password')}
            className="input input-bordered w-full"
          />
          <button
            // onClick={signInWithEmail}
            className="flex items-center justify-center bg-black text-white w-full h-12 flex-shrink-0 rounded-lg mt-4 gap-2"
          >
            <p>Sign up</p>
          </button>
        </form>
      </div>
    </div>
  );
}
