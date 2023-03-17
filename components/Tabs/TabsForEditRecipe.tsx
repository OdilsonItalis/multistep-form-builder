import * as React from 'react';
import { useRouter } from 'next/router';
import ReadOnlyEditor from '../Editor/ReadOnlyEditor';
import RecipeNutrition from '../IngredientPreview/RecipeNutrition';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import IngredientItemReusable from '../Diary/IngredientItemReusable';
import { SupabaseIngredient } from '@/utils/types';
import SingleIngredientEditingModal from '../Modals/SingleIngredientEditingModal';
import { setSelectedSingularItem } from '@/utils/features/searchStateSlice';
import ModalForAddingAdditionalIngredientToExistingRecipe from '../Modals/ModalForAddingAdditionalIngredientToExistingRecipe';
import { changeModalForAddingAdditionalIngredientToExistingRecipeStatus } from '@/utils/features/modalStateSlice';
import { useUser } from '@/utils/useUser';
import { Tab } from '@headlessui/react';
import { AnimatePresence } from 'framer-motion';
import PlusIcon from 'public/icons/PlusIcon';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function TabsForEditRecipe() {
  const [index, setIndex] = React.useState(0);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  const router = useRouter();

  const { user } = useUser();

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const dispatch = useAppDispatch();

  const selectedItem = useAppSelector(
    (state) => state.searchState.selectedItem
  );

  const handleSingleIngredientEdit = (ingredient: SupabaseIngredient) => {
    dispatch(setSelectedSingularItem(ingredient));
    setModalIsOpen(true);
  };

  const modalForAddingAdditionalIngredientToExistingRecipeModalState =
    useAppSelector(
      (state) =>
        state.modalState.ModalForAddingAdditionalIngredientToExistingRecipeOpen
    );

  if (!selectedItem) return null;

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
            {/* Here I want to add a dropdown of ingredients, so that if the selected item is meal user can edit all items individually*/}
            {'ingredients' in selectedItem &&
              selectedItem.ingredients.map((ingredient) => (
                <IngredientItemReusable
                  ingredient={ingredient}
                  key={ingredient?.uid}
                  clickHandler={() => handleSingleIngredientEdit(ingredient)}
                />
              ))}
            <button
              onClick={() =>
                dispatch(
                  changeModalForAddingAdditionalIngredientToExistingRecipeStatus(
                    true
                  )
                )
              }
              data-testid="addIngredient"
              className="relative m-2 flex h-8 w-8 items-center justify-center rounded-full border border-gray-400"
            >
              <PlusIcon height={20} width={20} />
            </button>
            <div className="flex justify-between gap-2 w-full max-w-xl p-2 mt-auto">
              <button
                onClick={() => router.push('/updateexisting')}
                data-testid="addIngredient"
                className="text-green-400 border border-green-400 capitalize flex ml-auto p-2 rounded flex-1 items-center justify-center bg-green-300/10"
              >
                <p className="text-sm">
                  update <br /> existing recipe
                </p>
              </button>
              <button
                onClick={() => router.push('/saveexisting')}
                data-testid="addIngredient"
                className="text-purple-400 capitalize border border-purple-400 p-2 rounded flex-1 items-center justify-center bg-purple-400/10"
              >
                <p className="text-sm">
                  Save
                  <br /> as a new recipe
                </p>
              </button>
            </div>
            {user?.app_metadata?.is_admin && (
              <div className="pb-2 px-2">
                <button
                  onClick={() => router.push('/stretchrecipev2')}
                  data-testid="addIngredient"
                  className="text-indigo-600 border h-14 border-indigo-600 capitalize flex ml-auto p-2 rounded flex-1 items-center justify-center w-full"
                >
                  <p className="text-sm">Duplicate recipe</p>
                </button>
              </div>
            )}
            <AnimatePresence>
              {modalIsOpen && (
                <SingleIngredientEditingModal
                  handleClose={handleModalClose}
                  handleOpen={modalIsOpen}
                />
              )}
              {modalForAddingAdditionalIngredientToExistingRecipeModalState && (
                <ModalForAddingAdditionalIngredientToExistingRecipe />
              )}
            </AnimatePresence>
          </Tab.Panel>
          <Tab.Panel className="h-full w-full" key={Math.random()}>
            <RecipeNutrition />
          </Tab.Panel>
          <Tab.Panel className="h-full w-full" key={Math.random()}>
            {'instructions' in selectedItem && selectedItem.instructions ? (
              <ReadOnlyEditor instructions={selectedItem.instructions} />
            ) : (
              <p>No instructions</p>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
