import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { supabase } from '../supabase-client';
import { RecipeForStretching, SupabaseRecipe } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { ensureError } from '../ensureError';

export const getRecipe = async (id: string | undefined) => {
  if (!id) {
    throw new Error('No id provided');
  }
  const recipeId = parseInt(id);
  let { data, error, count } = await supabase
    .from('recipes')
    .select(`*`, { count: 'exact' })
    .eq('id', recipeId);
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  if (count === 0) {
    return null;
  }

  if (data) {
    const recipe: unknown = {
      ...data?.[0],
      uid: uuidv4()
    };
    return recipe as SupabaseRecipe;
  }
};

export default function useGetRecipe(id: string | undefined) {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipe(id),
    enabled: !!id,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}

// This is for users saved recipes

const isRecipeSaved = async (
  userId: string | undefined,
  recipeId: number | undefined
) => {
  const { data, error } = await supabase
    .from('saved_recipes')
    .select(`*, recipe_id (*)`)
    .eq('user_id', userId)
    .eq('recipe_id', recipeId);
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  if (data && data.length > 0) {
    return true;
  } else {
    return false;
  }
};

export function useIsRecipeSaved(
  recipeId: number | undefined,
  userId: string | undefined
) {
  return useQuery({
    queryKey: ['savedFood', recipeId],
    queryFn: () => isRecipeSaved(userId, recipeId),
    enabled: !!recipeId && !!userId,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}

// this is for saving unsaving a recipe

const handleRecipeSave = async (userId: string, recipeId: number) => {
  const { error } = await supabase.from('saved_recipes').insert({
    user_id: userId,
    recipe_id: recipeId
  });
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
};

const handleRecipeDelete = async (userId: string, recipeId: number) => {
  const { error } = await supabase.from('saved_recipes').delete().match({
    user_id: userId,
    recipe_id: recipeId
  });
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
};

export function useUpdateSavedRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      recipeId
    }: {
      userId: string;
      recipeId: number;
    }) => {},
    onMutate: async ({ userId, recipeId }) => {
      await queryClient.cancelQueries(['savedFood', recipeId]);
      const isSaved: boolean | undefined = queryClient.getQueryData([
        'savedFood',
        recipeId
      ]);
      // don't really know what this line does, but will figure out later if needed
      queryClient.setQueryData(['savedFood', recipeId], !isSaved);
      // line below don't work for some reason
      // queryClient.refetchQueries({
      //   queryKey: ['savedRecipes', userId]
      // });
      if (isSaved) {
        handleRecipeDelete(userId, recipeId);
      } else {
        handleRecipeSave(userId, recipeId);
      }
      return {
        issaved: isSaved
      };
    },
    onError: (_error, props, context) => {
      const error = ensureError(_error);
      if (context) {
        queryClient.setQueryData(
          ['savedFood', props.recipeId],
          // @ts-ignore TODO: Figure out what is happening and fix this
          context.issaved
        );
      }
      toast.error(error.message);
    }
  });
}

export const getRecipeForStretching = async (id: string | undefined) => {
  if (!id) {
    throw new Error('No id provided');
  }
  const recipeId = parseInt(id);
  let { data, error } = await supabase
    .from('recipes')
    .select(`*`)
    .eq('id', recipeId)
    .single();
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  if (!data) {
    throw new Error('No data found');
  }
  // @ts-ignore TODO: fix this
  const ingredients = data?.ingredients.map((ingredient, index) => {
    return {
      ...ingredient,
      checked: false,
      order_number: index,
      max_amount: 0,

      increment_size:
        ingredient && ingredient.serving_quantity > 1
          ? ingredient.serving_quantity
          : 0
    };
  });

  const recipeDataForStretching = {
    ...data,
    // @ts-ignore TODO: check this later
    ingredients: ingredients,
    parent_recipe_id: data.id
  };
  return recipeDataForStretching;
};

export function useGetRecipeForStretching(id: string | undefined) {
  return useQuery({
    queryKey: ['recipeForStretching', id],
    queryFn: () => getRecipeForStretching(id),
    enabled: !!id,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}
