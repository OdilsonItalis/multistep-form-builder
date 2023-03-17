import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function TailwindTabs() {
  return (
    // <div className="w-full max-w-md px-2 sm:px-0 h-full">
    <div className="flex flex-col h-full">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
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
            Diary
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
            Workouts
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
            Recipes
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
            Mealplans
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2 flex w-full h-full">
          <Tab.Panel
            className="bg-red-400 h-full flex w-full"
            key={Math.random()}
          >
            <p>Vienas</p>
          </Tab.Panel>
          <Tab.Panel
            className="bg-red-400 h-full flex w-full"
            key={Math.random()}
          >
            <p>du</p>
          </Tab.Panel>
          <Tab.Panel
            className="bg-red-400 h-full flex w-full"
            key={Math.random()}
          >
            <p>trys</p>
          </Tab.Panel>
          <Tab.Panel
            className="bg-red-400 h-full flex w-full"
            key={Math.random()}
          >
            <p>keturi</p>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
