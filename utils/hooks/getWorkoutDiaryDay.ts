import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import toast from 'react-hot-toast';
import { CurrentWorkoutDay, Set } from '../currentWorkoutDayUtilFunctions';

const getWorkoutDiaryDay = async (
  userId: string | undefined,
  dateString: string
) => {
  const { data, error, count } = await supabase
    .from('workout_diary_days')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .eq('date', dateString)
    .limit(1);

  console.log({
    data,
    error,
    count
  });
  if (count === 0) {
    // need logic here where I would return template empty day
    return {
      date: dateString,
      title: 'Untitled',
      exercises: []
    };
  }
  if (data) {
    return data[0];
  }
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
};

export default function useGetWorkoutDiaryDay(
  userId: string | undefined,
  dateString: string
) {
  return useQuery({
    queryKey: ['workoutDiaryDay', userId, dateString],
    queryFn: () => getWorkoutDiaryDay(userId, dateString),
    enabled: !!userId,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}

// this is to update the diary day

const updateCurrentWorkoutDay = async (
  updatedDiary: CurrentWorkoutDay,
  userId: string | undefined
) => {
  if (!userId) {
    throw new Error('User is not logged in');
  }
  const { error } = await supabase
    .from('workout_diary_days')
    .upsert({ user_id: userId, ...updatedDiary });
  // don't know if I need to throw error or usemutation will do it for me
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
};

export function useUpdateCurrentWorkoutDay() {
  return useMutation({
    mutationFn: async ({
      updatedDiary,
      userId
    }: {
      updatedDiary: CurrentWorkoutDay;

      // TODO: why did I let this be undefined? I should check for it before calling this function
      userId: string | undefined;
    }) => {
      // before I wasn't using return and onerror wasn't working
      return updateCurrentWorkoutDay(updatedDiary, userId);
    },
    onSuccess: () => {
      // toast.success('Day updated');
    },
    onError: (error) => {
      toast.error(
        "We couldn't save your diary please check your internet  connection!"
      );
    }
  });
}

const updateSet = async (
  set: Set,
  userId: string | undefined,
  dateString: string,
  exerciseOrderNumber: number,
  index: number
) => {
  if (!userId) {
    throw new Error('User is not logged in');
  }
  console.log(set);
  const { error } = await supabase.from('sets').upsert({
    user_id: userId,
    date: dateString,
    ...set,
    exercise_order_number: exerciseOrderNumber,
    index
  });
  // don't know if I need to throw error or usemutation will do it for me
  if (error) {
    console.log(error);
    throw new Error(`${error.message}: ${error.details}`);
  }
};

export function useUpdateSet() {
  return useMutation({
    mutationFn: async ({
      set,
      userId,
      dateString,
      exerciseOrderNumber,
      index
    }: {
      set: Set;
      dateString: string;
      exerciseOrderNumber: number;
      index: number;

      // TODO: why did I let this be undefined? I should check for it before calling this function
      userId: string | undefined;
    }) => {
      // before I wasn't using return and onerror wasn't working
      return updateSet(set, userId, dateString, exerciseOrderNumber, index);
    },
    onSuccess: () => {
      toast.success('Set updated');
    },
    onError: (error) => {
      toast.error(
        "We couldn't save your set please check your internet  connection!"
      );
    }
  });
}
