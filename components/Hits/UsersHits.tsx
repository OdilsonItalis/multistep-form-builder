import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import { useGetFullTextSearchUsers } from '@/utils/hooks/useFullTextSearchIngredients';
import React, { useState } from 'react';
import * as animationData from '../../public/93134-not-found.json';
import Lottie from 'react-lottie';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

const NoHits = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold">No hits</h1>
        <p className="text-lg">Try to change your search terms.</p>
        <Lottie
          options={defaultOptions}
          height={300}
          width={300}
          // isStopped={this.state.isStopped}
          // isPaused={this.state.isPaused}
        />
      </div>
    </div>
  );
};

function UsersHits() {
  const router = useRouter();
  const usersSearchState = useAppSelector(
    (state) => state.searchState.usersSearchState
  );
  const { data, isLoading, error } =
    useGetFullTextSearchUsers(usersSearchState);
  const dispatch = useAppDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [itemIndex, setItemIndex] = useState<null | number>(null);

  const handleModalClose = () => {
    // router.push(`/additem`, undefined, {
    //   shallow: true,
    //   scroll: false
    // });
    setModalIsOpen(false);
  };

  const handleClick = (username: string | null, index: number) => {
    setItemIndex(index);
    if (username === null) {
      toast.error('This user needs to set a username, to be able to be found.');
      return;
    }
    router.push(`/${username}`);
  };

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {data === null && <NoHits />}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 pb-20`}>
        {data &&
          data.map((user, index) => {
            return (
              <button
                className={`${itemIndex === index ? 'opacity-10' : ''}`}
                onClick={() => handleClick(user.username, index)}
              >
                <div
                  // onClick={() => router.push(`/${hit.username}`)}
                  className="flex h-24 gap-2"
                >
                  <img
                    src={user.avatar_url || '/banner-placeholder.svg'}
                    alt=""
                    className="aspect-square w-24 rounded-lg object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="flex">
                      <p className="text-sm font-semibold">{user.username}</p>
                      {/*
                    // verified badge is not needed yet
                    
                    {user?.verified && (
                      <img
                        className="h-5 w-5"
                        src="https://cdn141.picsart.com/282944038008211.png?type=webp&to=min&r=640"
                      />
                    )} */}
                    </div>
                    <p className="text-sm">{user.full_name}</p>
                  </div>
                </div>
              </button>
            );
          })}
      </div>
    </>
  );
}

export default UsersHits;
