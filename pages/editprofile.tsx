import React, { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { supabase } from '@/utils/supabase-client';
import { useUser } from '@/utils/useUser';
import debounce from 'lodash.debounce';
import { useGetPrivateUser } from '@/utils/hooks/userHooks';
import AddImageRound from '@/components/ImageUpload/AddImageRound';
import axios from 'axios';
import { getBase64FromUrl } from '@/utils/helpers';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/utils/hooks/rtkhooks';
import { changeAuthModalStatus } from '@/utils/features/modalStateSlice';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import toast, { Toaster } from 'react-hot-toast';
import SexButtons from '@/components/StarterForm/SexButtons';
import ArrowBack from 'public/icons/ArrowBack';
import AddBannerImage from '@/components/ImageUpload/AddBannerImage';
import CheckIcon from 'public/icons/CheckIcon';
import ReactGoogleAutocompleteForm from '@/components/ReactGoogleAutocompleteForm';

interface Inputs {
  full_name: string;
  username: string;
  dob: string;
  bio: string;
}

export interface Location {
  latitude: number;
  longtitude: number;
  city: string;
  country: string;
}

export const getServerSideProps = withPageAuth();

function Settings() {
  const [date, setDate] = useState<Date | null>(null);
  const [file, setFile] = useState<string | null>(null);
  const [changed, setChanged] = useState<boolean>(false);
  const [bannerFile, setBannerFile] = useState<string | null>(null);
  const [location, setLocation] = React.useState<Location | null>(null);
  const [address, setAddress] = React.useState('');
  const starterForm = useAppSelector((state) => state.starterForm);
  const { user, isLoading: userIsLoading } = useUser();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<Inputs>();

  // TODO: this still needs to be double checked

  const onSubmit: SubmitHandler<Inputs> = async (data, event) => {
    if (!user) {
      changeAuthModalStatus(true);
      return;
    }
    try {
      toast.loading('Updating profile...');
      if (file && changed) {
        console.log('this should not appear here');
        const res = await axios.post(`/api/handle-profile-image-update`, {
          image: file
        });
        if (res.data.message === 'success') {
          toast.success('profile image updated');
        }
      }
      if (bannerFile) {
        const res = await axios.post(`/api/handle-profile-banner-upload`, {
          image: bannerFile
        });
        if (res.data.message === 'success') {
          toast.success('banner image updated');
        }
      }

      const { data: profileUpdate, error } = await supabase
        .from('users')
        .update({
          ...(data.full_name && { full_name: data.full_name }),
          ...(date && { date_of_birth: date.toISOString() }),
          ...(data.username && { username: data.username.toLocaleLowerCase() }),
          ...(data.bio && { bio: data.bio })
        })
        .eq('id', user.id);
      if (error) {
        toast.error('Something went wrong');
        console.log(error.message);
        return;
      }
      toast.dismiss();
      toast.success('profile updated');
    } catch (error) {
      toast.dismiss();
      toast.error('Something went wrong');
    }
  };

  const username = watch('username');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const {
    data: profile,
    isLoading: profileIsLoading,
    isError
  } = useGetPrivateUser(user?.id);

  const checkUsername = useCallback(
    debounce(async (username) => {
      let regex = new RegExp('^([a-z0-9.]{1,29}[a-z0-9])$');
      if (regex.test(username.toLowerCase())) {
        console.log(`username is ${username.toLowerCase()}`);
        console.log('The string matches the regex.');
      } else {
        console.log('The string does not match the regex.');
      }
      if (username.length >= 3) {
        setLoading(true);
        const { data, error, count } = await supabase
          .from('public_user_info')
          .select('username', { count: 'exact' })
          .eq('username', username.toLowerCase());

        console.log({
          data,
          error,
          count
        });

        if (count === 0 && regex.test(username.toLowerCase())) {
          setIsValid(true);
          console.log('count is 0');
        }
        if (count === 1) {
          setIsValid(false);
          console.log('count is 1');
        }
        setLoading(false);
        setReady(true);
      }
    }, 500),
    []
  );

  useEffect(() => {
    console.log(profile);
    if (profile && profile?.avatar_url) {
      const profilePhoto = `${profile?.avatar_url}?v=${Date.now()}`;
      getBase64FromUrl(profilePhoto).then((res) => {
        setFile(res as string);
      });
    }
    if (profile && profile?.banner_url) {
      const bannerPhoto = `${profile?.banner_url}?v=${Date.now()}`;
      getBase64FromUrl(bannerPhoto).then((res) => {
        setBannerFile(res as string);
      });
    }
  }, [profile]);

  useEffect(() => {
    setIsValid(false);
    if (username?.length >= 3) {
      setReady(false);
      checkUsername(username);
    }
  }, [username]);

  if (userIsLoading || profileIsLoading) {
    return <div>Loading...</div>;
  }

  if (profile) {
    return (
      <div className="flex flex-col max-w-2xl mx-auto w-full px-2 sm:px-0 pb-20 safeAreaInset relative">
        <Toaster />
        <div className="flex flex-col w-full p-2">
          <div className="flex w-full">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 justify-center items-center flex aspect-square"
            >
              <ArrowBack height={20} width={20} color={'#000000'} />
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className="flex ml-auto items-center justify-center gap-1 w-36 text-sm text-white h-8 bg-black rounded-full"
            >
              <CheckIcon height={18} width={18} color="#FFF" />
              <p>Save Changes</p>
            </button>
          </div>
        </div>
        <AddBannerImage file={bannerFile} setFile={setBannerFile} />
        <div className="flex justify-between">
          <div className="-mt-12 ml-2">
            <AddImageRound
              file={file}
              setFile={setFile}
              setChanged={setChanged}
            />
          </div>
        </div>
        <div className="flex flex-col px-2">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="Full Name"
              {...register('full_name')}
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="Username"
              {...register('username')}
              className={`input input-bordered w-full`}
            />
            <UsernameMessage
              username={username}
              isValid={isValid}
              loading={loading}
              ready={ready}
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Bio</span>
            </label>
            <textarea
              {...register('bio')}
              className="textarea textarea-bordered"
              placeholder="Bio up to 140 characters"
            ></textarea>
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Where are you from?</span>
            </label>
            <ReactGoogleAutocompleteForm />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Your sex</span>
            </label>
            <SexButtons />
          </div>
        </div>
      </div>
    );
  }
  if (isError) {
    return <div>Something went wrong...</div>;
  }
}

export default Settings;

function UsernameMessage({
  username,
  isValid,
  loading,
  ready
}: {
  username: string;
  isValid: boolean;
  loading: boolean;
  ready: boolean;
}) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid && username.length >= 3) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && ready && !isValid && username?.length >= 3) {
    return (
      <p className="text-danger text-red-400">
        That username is not available!
      </p>
    );
  } else if (username?.length < 3 && username?.length > 0) {
    return (
      <p className="text-xs italic text-gray-400">
        username has to be at least 3 letters
      </p>
    );
  } else {
    return <p></p>;
  }
}
