// TODO: Most of these is just a copy of recipe and workouts hooks, so I have to double check this if there are no errors.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { supabase } from '../supabase-client';
import { RecipeForStretching, SupabaseRecipe } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { ensureError } from '../ensureError';
import { Database } from 'types_db';

// This is for users saved workouts

const isMealplanSaved = async (
  userId: string | undefined,
  mealplanId: number | undefined
) => {
  const { data, error } = await supabase
    .from('saved_mealplans')
    .select(`*, mealplan_id (*)`)
    .eq('user_id', userId)
    .eq('mealplan_id', mealplanId);
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  if (data && data.length > 0) {
    return true;
  } else {
    return false;
  }
};

export function useIsMealplanSaved(
  mealplanId: number | undefined,
  userId: string | undefined
) {
  return useQuery({
    queryKey: ['savedMealplans', mealplanId],
    queryFn: () => isMealplanSaved(userId, mealplanId),
    enabled: !!mealplanId && !!userId,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}

// this is for saving andunsaving workouts

const handleMealplanSave = async (userId: string, mealplanId: number) => {
  const { error } = await supabase.from('saved_mealplans').insert({
    user_id: userId,
    mealplan_id: mealplanId
  });
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
};

const handleMealplanDelete = async (userId: string, mealplanId: number) => {
  const { error } = await supabase.from('saved_mealplans').delete().match({
    user_id: userId,
    mealplan_id: mealplanId
  });
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
};

// TODO: I have to check if this is the right way to do it, because I don't know if I need to use useMutation or useQuery
export function useUpdateSavedMealplans() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      mealplanId
    }: {
      userId: string;
      mealplanId: number;
    }) => {},
    onMutate: async ({ userId, mealplanId }) => {
      await queryClient.cancelQueries(['savedMealplans', mealplanId]);
      const isSaved: boolean | undefined = queryClient.getQueryData([
        'savedMealplans',
        mealplanId
      ]);
      // don't really know what this line does, but will figure out later if needed
      queryClient.setQueryData(['savedMealplans', mealplanId], !isSaved);
      if (isSaved) {
        handleMealplanDelete(userId, mealplanId);
      } else {
        handleMealplanSave(userId, mealplanId);
      }
      return {
        issaved: isSaved
      };
    },
    onError: (_error, props, context) => {
      const error = ensureError(_error);
      if (context) {
        queryClient.setQueryData(
          ['savedMealplans', props.mealplanId],
          // @ts-ignore TODO: Figure out what is happening and fix this
          context.issaved
        );
      }
      toast.error(error.message);
    }
  });
}

export const getMealplans = async (id: string | undefined) => {
  const { data, error } = await supabase
    .from('saved_mealplans')
    .select(`*, mealplan:mealplan_id (*)`)
    .eq('user_id', id)
    .order('saved_at', { ascending: false });

  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  if (data) {
    const mealplans = data.map((mealplan) => mealplan.mealplan);
    // TODO: will have to check if I really need to do this
    return mealplans as unknown as Database['public']['Tables']['mealplans']['Row'][];
  }
  return [];
};

export default function useGetSavedMealplans(id: string | undefined) {
  return useQuery({
    queryKey: ['savedMealplans', id],
    queryFn: () => getMealplans(id),
    enabled: !!id,
    refetchOnMount: true, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}
