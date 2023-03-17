import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import {
  SingleIngredient,
  SupabaseIngredient,
  SupabaseRecipe,
  UserPublic
} from '../types';

const getFullTextSearchIngredients = async (
  queryString: string | undefined
) => {
  let query = supabase
    .from('ingredients')
    .select(
      'id,product_name,nutrients,number_of_servings,barcode,amount,serving_size_string,source,thumbnail_url,image_url,serving_quantity,food_portions,popularity',
      {
        count: 'exact'
      }
    )
    .order('popularity', { ascending: false })
    .limit(20);

  if (queryString) {
    query = query.textSearch('product_name', queryString, {
      type: 'plain',
      config: 'english'
    });
  }

  const { data, count, error } = await query;

  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }

  if (count === 0) {
    return null;
  }
  return data;
};

export default function useGetFullTextSearchIngredients(
  queryString: string | undefined
) {
  return useQuery({
    queryKey: ['ingredients', queryString],
    queryFn: () => getFullTextSearchIngredients(queryString),
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}

// This is for recipes

export const getFullTextSearchRecipes = async (
  queryString: string | undefined
) => {
  let query = supabase
    .from('recipes')
    .select(`*`, { count: 'exact' })
    .limit(50);

  if (queryString) {
    query = query.textSearch('product_name', queryString, {
      type: 'plain',
      config: 'english'
    });
  }

  const { data, count, error } = await query;
  // Filters

  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }

  if (count === 0) {
    return null;
  }
  return data;
};

export function useGetFullTextSearchRecipes(queryString: string | undefined) {
  return useQuery({
    queryKey: ['recipes', queryString],
    queryFn: () => getFullTextSearchRecipes(queryString),
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}
// This is for users

export const getFullTextSearchUsers = async (
  queryString: string | undefined
) => {
  let query = supabase
    .from('public_user_info')
    .select('*', {
      count: 'exact'
    })
    .gt('full_name', '')
    .limit(20);

  if (queryString) {
    query = query.textSearch('full_name', queryString, {
      type: 'plain',
      config: 'english'
    });
  }

  const { data, count, error } = await query;
  console.log({
    data,
    count,
    error
  });
  // Filters

  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }

  if (count === 0) {
    return null;
  }
  return data;
};

export function useGetFullTextSearchUsers(queryString: string | undefined) {
  return useQuery({
    queryKey: ['users', queryString],
    queryFn: () => getFullTextSearchUsers(queryString),
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}

// This is for the exercises

const getExercises = async (queryString: string | undefined) => {
  let query = supabase
    .from('exercises')
    .select('*', {
      count: 'exact'
    })
    .order('ranking', { ascending: false })
    .limit(20);

  if (queryString) {
    query = query.textSearch('exercise_name', queryString, {
      type: 'plain',
      config: 'english'
    });
  }

  const { data, count, error } = await query;

  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }

  if (count === 0) {
    return null;
  }
  return data;
};

export function useGetFullTextExercises(queryString: string | undefined) {
  return useQuery({
    queryKey: ['exercises', queryString],
    queryFn: () => getExercises(queryString),
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}

// This is for the workouts

export const getWorkouts = async () => {
  let query = supabase
    .from('workouts')
    .select('*', {
      count: 'exact'
    })
    .limit(20);

  const { data, count, error } = await query;
  // Filters

  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }

  if (count === 0) {
    return null;
  }
  return data;
};

export function useGetWorkouts() {
  return useQuery({
    queryKey: ['workouts'],
    queryFn: () => getWorkouts(),
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}
// This is for users

const getFullTextSearchMealplans = async (queryString: string | undefined) => {
  let query = supabase
    .from('mealplans')
    .select('*', {
      count: 'exact'
    })
    // .order('popularity', { ascending: false })
    .limit(20);

  if (queryString) {
    query = query.textSearch('title', queryString, {
      type: 'plain',
      config: 'english'
    });
  }

  const { data, count, error } = await query;

  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }

  if (count === 0) {
    return null;
  }
  return data;
};

export function useGetFullTextSearchMealplans(queryString: string | undefined) {
  return useQuery({
    queryKey: ['mealplans', queryString],
    queryFn: () => getFullTextSearchMealplans(queryString),
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}
