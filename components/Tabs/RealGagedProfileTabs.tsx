import { changePublicProfileTabState } from '@/utils/features/tabStateSlice';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import { Tab } from '@headlessui/react';
import PartnerPricingOptions from '../PartnerPricingOptions';
import PricingComponent from '../PricingComponent';
import RealGagedPortfolioTab from './RealGagedPortfolioTab';
import StripeConnectProductsView from './StripeConnectProductsView';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function RealGagedProfileTabs() {
  const dispatch = useAppDispatch();
  const index = useAppSelector((state) => state.tabState.publicProfileTabState);
  return (
    <div className="flex flex-col flex-1 w-full mx-auto">
      <Tab.Group
        defaultIndex={index}
        onChange={(index) => {
          dispatch(changePublicProfileTabState(index));
        }}
      >
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 my-4 max-w-sm mx-auto w-full">
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
            Portfolio
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
            Services
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
            Reviews
          </Tab>
        </Tab.List>
        {/* <p className="flex-1 h-full bg-red-900">siuu2</p> */}
        <Tab.Panels className="mt-1 flex w-full h-full">
          <Tab.Panel className="flex flex-col w-full" key={Math.random()}>
            <RealGagedPortfolioTab />
          </Tab.Panel>
          <Tab.Panel
            className="flex flex-col w-full h-full"
            key={Math.random()}
          >
            {/* <StripeConnectProductsView /> */}
            <PricingComponent />
          </Tab.Panel>
          <Tab.Panel
            className="flex flex-col w-full h-full"
            key={Math.random()}
          >
            <p className="h-full">something here</p>
            {/* <PartnerPricingOptions /> */}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
