import * as React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Provider } from '@supabase/supabase-js';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAppDispatch } from '@/utils/hooks/rtkhooks';
import { changeAuthModalStatus } from '@/utils/features/modalStateSlice';
import { useUser } from '@/utils/useUser';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import AppleIcon from 'public/icons/AppleIcon';
import { SubmitHandler, useForm } from 'react-hook-form';
import SearchIcon from 'public/icons/SearchIcon';
import axios from 'axios';

interface FormValues {
  email: string;
  password: string;
}

export default function AuthModal() {
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const supabaseClient = useSupabaseClient();
  const [otp, setOtp] = React.useState('');
  const [modalState, setModalState] = React.useState<
    'signin' | 'signinotp' | 'forgotpassword' | 'signup'
  >('signin');

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

  const handleClose = () => {
    dispatch(changeAuthModalStatus(false));
    // toast.error('Please sign in to continue');
  };

  const handleOAuthSignIn = async (provider: Provider) => {
    toast.error('OAuth sign in is not supported yet');
    // toast.loading('Signing you in with ' + provider + '...');
    // const { error } = await supabaseClient.auth.signInWithOAuth({
    //   provider
    //   // options: { redirectTo: getURL() }
    // });
    // if (!error) toast.dismiss();
    // if (error) {
    //   toast.error(error.message);
    //   toast.dismiss();
    // }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { data: signInWithPasswordData, error } =
      await supabaseClient.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
    if (error) {
      toast.error(error.message);
      return;
    }
  };
  const onSubmitSignup: SubmitHandler<FormValues> = async (data) => {
    const { data: signupData, error } = await supabaseClient.auth.signUp({
      email: data.email,
      password: data.password
    });

    if (signupData) {
      console.log(signupData);
      toast.success('Please check your email for the verification link');
      setModalState('signin');
    }

    if (error) {
      toast.error(error.message);
      return;
    }
  };
  const onSubmitPasswordReset: SubmitHandler<FormValues> = async (data) => {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(
      data.email,
      {
        redirectTo: 'http://localhost:3000/reset-password'
      }
    );

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Please check your email for the password reset link');
  };

  React.useEffect(() => {
    if (user) {
      dispatch(changeAuthModalStatus(false));
    }
  }, [user]);

  return (
    <div>
      <Toaster />
      <Dialog className="fixed inset-0 z-10" onClose={handleClose} open={true}>
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
            className="z-0 flex flex-col w-full h-full bg-white rounded-t-lg shadow-xl max-w-2xl mx-auto overflow-scroll"
          >
            <img
              src="/realgaged-logo2.svg"
              alt=""
              className="sm:h-[800px] sm:w-[800px] mx-auto absolute inset-0 mt-10 opacity-20 -z-10"
            />
            <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto w-full px-4 sm:px-0">
              {modalState === 'signin' && (
                <>
                  <button
                    // disabled={loading}
                    onClick={() => handleOAuthSignIn('google')}
                    type="button"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-black bg-white/80 text-sm font-semibold tracking-wider flex-shrink-0 mb-4 relative"
                  >
                    <img
                      src="https://developers.google.com/identity/images/g-logo.png"
                      alt=""
                      className="h-5 w-5"
                    />
                    <p>Continue with Google</p>
                  </button>
                  <button
                    onClick={() => handleOAuthSignIn('apple')}
                    type="button"
                    className="flex h-12 w-full items-center justify-center  gap-2 rounded-full bg-black/80 text-sm font-semibold  tracking-wider text-white relative"
                  >
                    <AppleIcon width={20} height={20} color="#FFFFFF" />
                    <p>Continue with Apple</p>
                  </button>
                  <div className="divider my-8">OR</div>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col w-full gap-2"
                  >
                    <input
                      type="email"
                      placeholder="Email"
                      {...register('email')}
                      className="input input-bordered w-full bg-white/80"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      {...register('password')}
                      className="input input-bordered w-full bg-white/80"
                    />
                    <button
                      type="submit"
                      className="flex items-center justify-center bg-black text-white w-full h-12 flex-shrink-0 rounded-lg mt-4 gap-2"
                    >
                      <p>Sign in with Email</p>
                    </button>
                  </form>
                  <div className="flex justify-between w-full py-4">
                    <a
                      onClick={() => setModalState('forgotpassword')}
                      className="link link-neutral text-sm"
                    >
                      Forgot password?
                    </a>
                    <a
                      onClick={() => setModalState('signup')}
                      className="link link-primary"
                    >
                      Create account
                    </a>
                  </div>
                </>
              )}

              {modalState === 'signup' && (
                <>
                  <h1 className="font-semibold p-4">Create new account</h1>
                  <form
                    onSubmit={handleSubmit(onSubmitSignup)}
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
                  <a
                    onClick={() => setModalState('signin')}
                    className="link link-primary ml-auto py-4"
                  >
                    Sign in using other method instead
                  </a>
                </>
              )}

              {modalState === 'forgotpassword' && (
                <>
                  <h1 className="font-semibold p-4">Password recovery</h1>
                  <form
                    onSubmit={handleSubmit(onSubmitPasswordReset)}
                    className="flex flex-col w-full gap-2"
                  >
                    <input
                      type="email"
                      placeholder="Email"
                      {...register('email')}
                      className="input input-bordered w-full"
                    />
                    <button
                      // onClick={signInWithEmail}
                      className="flex items-center justify-center bg-black text-white w-full h-12 flex-shrink-0 rounded-lg mt-4 gap-2"
                    >
                      <p>Send me a reset link</p>
                    </button>
                  </form>
                  <a
                    onClick={() => setModalState('signin')}
                    className="link link-primary ml-auto py-4"
                  >
                    Sign in using other method instead
                  </a>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </Dialog>
    </div>
  );
}
