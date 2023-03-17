import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Tab } from '@headlessui/react';
import {
  useGetFullTextSearchMealplans,
  useGetFullTextSearchRecipes,
  useGetFullTextSearchUsers
} from '@/utils/hooks/useFullTextSearchIngredients';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import {
  changeRecipeSearchState,
  changeUsersSearchState
} from '@/utils/features/searchStateSlice';
import UsersHits from '@/components/Hits/UsersHits';
import { changeDiscoveryTabState } from '@/utils/features/tabStateSlice';
import BasicLayout from '@/components/Layout/BasicLayout';
import SearchIcon from 'public/icons/SearchIcon';
import FilterIcon from 'public/icons/FiltersIcon';
import TabForJobs from '@/components/Tabs/TabForJobs';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const SearchBoxForUsers = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.searchState.usersSearchState);
  const { data, refetch } = useGetFullTextSearchUsers(query);

  useEffect(() => {
    refetch();
  }, [query]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="flex h-10 px-2 gap-2">
      <div className="flex flex-grow items-center rounded-lg bg-gray-100 px-2 py-2 text-gray-600">
        <SearchIcon height={20} width={20} />
        <input
          type="search"
          placeholder="Search For Users"
          className="tex-base flex-grow bg-transparent px-1 outline-none"
          value={query}
          onChange={(event) =>
            dispatch(changeUsersSearchState(event.currentTarget.value))
          }
        />
      </div>
      <button className="h-10 w-10 flex justify-center items-center">
        <FilterIcon height={20} width={20} />
      </button>
    </div>
  );
};
const SearchBoxForRecipes = () => {
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.searchState.recipeSearchState);
  const { data, refetch } = useGetFullTextSearchRecipes(query);

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <div className="flex h-10 px-2 gap-2">
      <div className="flex flex-grow items-center rounded-lg bg-gray-100 px-2 py-2 text-gray-600">
        <SearchIcon height={20} width={20} />
        <input
          type="search"
          placeholder="Search For Jobs"
          className="tex-base flex-grow bg-transparent px-1 outline-none"
          value={query}
          onChange={(event) =>
            dispatch(changeRecipeSearchState(event.currentTarget.value))
          }
        />
      </div>
      <button className="h-10 w-10 flex justify-center items-center">
        <FilterIcon height={20} width={20} />
      </button>
    </div>
  );
};

function Discovery() {
  const index = useAppSelector((state) => state.tabState.discoveryTabState);
  const dispatch = useAppDispatch();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(changeDiscoveryTabState(newValue));
  };

  return (
    <BasicLayout>
      <div className="flex flex-col h-full">
        <Tab.Group
          defaultIndex={index}
          onChange={(index) => {
            dispatch(changeDiscoveryTabState(index));
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
              Creators
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
              Jobs
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
              Services
            </Tab>
          </Tab.List>
          {index === 0 && <SearchBoxForUsers />}
          {index === 1 && <SearchBoxForRecipes />}
          <Tab.Panels className="mt-2 flex w-full h-full">
            <Tab.Panel className="h-full w-full" key={Math.random()}>
              <UsersHits />
            </Tab.Panel>
            <Tab.Panel className="h-full w-full" key={Math.random()}>
              <TabForJobs />
            </Tab.Panel>
            <Tab.Panel className="h-full w-full" key={Math.random()}>
              <p>third tab</p>
            </Tab.Panel>
            <Tab.Panel className="h-full w-full" key={Math.random()}>
              <p>fourth tab</p>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </BasicLayout>
  );
}

export default Discovery;
