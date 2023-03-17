import { changePPVModalStatus } from '@/utils/features/modalStateSlice';
import { changePublicProfileTabState } from '@/utils/features/tabStateSlice';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import { Tab } from '@headlessui/react';
import { AnimatePresence } from 'framer-motion';
import LockedIcon from 'public/icons/LockedIcon';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function PPVProfileTabs() {
  const dispatch = useAppDispatch();

  const index = useAppSelector((state) => state.tabState.publicProfileTabState);

  const ppvModalState = useAppSelector(
    (state) => state.modalState.ppvModalOpen
  );

  const handleOpenPricingModal = () => {
    dispatch(changePPVModalStatus(true));
  };

  return (
    <div className="flex flex-col">
      <Tab.Group
        defaultIndex={index}
        onChange={(index) => {
          dispatch(changePublicProfileTabState(index));
        }}
      >
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mx-1 my-2">
          <Tab
            key={Math.random()}
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-400 peer/Diary',
                'ring-white ring-opacity-60 focus:outline-none',
                selected
                  ? 'bg-white text-gray-600 shadow'
                  : 'text-gray-400 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            <div className="flex items-center justify-center">
              <p>Diary</p>
              <LockedIcon height={15} width={15} />
            </div>
          </Tab>
          <Tab
            key={Math.random()}
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-400 peer/Workouts',
                'ring-white ring-opacity-60 focus:outline-none',
                selected
                  ? 'bg-white text-gray-600 shadow'
                  : 'text-gray-400 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            <div className="flex items-center justify-center">
              <p>Logbook</p>
              <LockedIcon height={15} width={15} />
            </div>
          </Tab>
          <Tab
            key={Math.random()}
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-400 peer/Recipes',
                'ring-white ring-opacity-60 focus:outline-none',
                selected
                  ? 'bg-white text-gray-600 shadow'
                  : 'text-gray-400 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            <div className="flex items-center justify-center">
              <p>Recipes</p>
              <LockedIcon height={15} width={15} />
            </div>
          </Tab>
          <Tab
            key={Math.random()}
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-400 peer/Mealplans',
                'ring-white ring-opacity-60 focus:outline-none',
                selected
                  ? 'bg-white text-gray-600 shadow'
                  : 'text-gray-400 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            <div className="flex items-center justify-center">
              <p>Workouts</p>
              <LockedIcon height={15} width={15} />
            </div>
          </Tab>
        </Tab.List>
      </Tab.Group>
    </div>
  );
}
