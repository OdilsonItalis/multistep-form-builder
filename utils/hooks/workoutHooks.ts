import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { supabase } from '../supabase-client';
import { ensureError } from '../ensureError';
import { Database } from 'types_db';

// This is for users saved workouts

const isWorkoutSaved = async (
  userId: string | undefined,
  workoutId: number | undefined
) => {
  const { data, error } = await supabase
    .from('saved_workouts')
    .select(`*, workout_id (*)`)
    .eq('user_id', userId)
    .eq('workout_id', workoutId);
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  if (data && data.length > 0) {
    return true;
  } else {
    return false;
  }
};

export function useIsWorkoutSaved(
  workoutId: number | undefined,
  userId: string | undefined
) {
  return useQuery({
    queryKey: ['savedWorkouts', workoutId],
    queryFn: () => isWorkoutSaved(userId, workoutId),
    enabled: !!workoutId && !!userId,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}

// this is for saving andunsaving workouts

const handleWorkoutSave = async (userId: string, workoutId: number) => {
  const { error } = await supabase.from('saved_workouts').insert({
    user_id: userId,
    workout_id: workoutId
  });
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
};

const handleWorkoutDelete = async (userId: string, workoutId: number) => {
  const { error } = await supabase.from('saved_workouts').delete().match({
    user_id: userId,
    workout_id: workoutId
  });
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
};

export function useUpdateSavedWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      workoutId
    }: {
      userId: string;
      workoutId: number;
    }) => {},
    onMutate: async ({ userId, workoutId }) => {
      await queryClient.cancelQueries(['savedWorkouts', workoutId]);
      const isSaved: boolean | undefined = queryClient.getQueryData([
        'savedWorkouts',
        workoutId
      ]);
      // don't really know what this line does, but will figure out later if needed
      queryClient.setQueryData(['savedWorkouts', workoutId], !isSaved);
      if (isSaved) {
        handleWorkoutDelete(userId, workoutId);
      } else {
        handleWorkoutSave(userId, workoutId);
      }
      return {
        issaved: isSaved
      };
    },
    onError: (_error, props, context) => {
      const error = ensureError(_error);
      if (context) {
        queryClient.setQueryData(
          ['savedWorkouts', props.workoutId],
          // @ts-ignore Todo: check what is going on here and all the other React query examples that are using context
          context.issaved
        );
      }
      toast.error(error.message);
    }
  });
}

export const getWorkouts = async (id: string | undefined) => {
  const { data, error } = await supabase
    .from('saved_workouts')
    .select(`*, workout:workout_id (*)`)
    .eq('user_id', id)
    .order('saved_at', { ascending: false });

  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  if (data) {
    const workouts = data.map((workout) => workout.workout);
    // TODO: will have to check if I really need to do this
    return workouts as unknown as Database['public']['Tables']['workouts']['Row'][];
  }
  return [];
};

export default function useGetSavedWorkouts(id: string | undefined) {
  return useQuery({
    queryKey: ['savedWorkouts', id],
    queryFn: () => getWorkouts(id),
    enabled: !!id,
    refetchOnMount: true, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}
