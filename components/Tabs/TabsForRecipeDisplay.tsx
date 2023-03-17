import * as React from 'react';
import IngredientItemReusable from '../Diary/IngredientItemReusable';
import { SupabaseRecipe } from '@/utils/types';
import ReadOnlyEditor from '../Editor/ReadOnlyEditor';
import { useRouter } from 'next/router';
import { useUser } from '@/utils/useUser';
import { useAppDispatch } from '@/utils/hooks/rtkhooks';
import { changeAuthModalStatus } from '@/utils/features/modalStateSlice';
import RecipeNutritionV2 from '../IngredientPreview/RecipeNutritionv2';
import { Tab } from '@headlessui/react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  recipe: SupabaseRecipe;
}

export default function TabsForRecipeDisplay({ recipe }: Props) {
  const [index, setIndex] = React.useState(0);
  const { user } = useUser();
  const router = useRouter();

  const dispatch = useAppDispatch();

  const ingredientHandler = () => {
    if (!user) {
      dispatch(changeAuthModalStatus(true));
    } else {
      alert('this is single ingredient');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Tab.Group
        defaultIndex={index}
        onChange={(index) => {
          setIndex(index);
        }}
      >
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mx-1 my-2 ">
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
            Ingredients
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
            Nutrition
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
            Instructions
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2 flex w-full h-full">
          <Tab.Panel
            className="h-full w-full flex flex-col"
            key={Math.random()}
          >
            {recipe.ingredients?.map((ingredient) => (
              <>
                <IngredientItemReusable
                  ingredient={ingredient}
                  key={ingredient.uid}
                  clickHandler={ingredientHandler}
                />
              </>
            ))}
          </Tab.Panel>
          <Tab.Panel className="h-full w-full" key={Math.random()}>
            <RecipeNutritionV2 selectedItem={recipe} />
          </Tab.Panel>
          <Tab.Panel className="h-full w-full" key={Math.random()}>
            {recipe.instructions ? (
              <ReadOnlyEditor instructions={recipe.instructions} />
            ) : (
              <p>No instructions</p>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
