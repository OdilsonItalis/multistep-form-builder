import Stripe from 'stripe';

export interface SingleIngredient {
  id: number;
  amount: number;
  uid: string;
  thumbnail?: string | null;
  product_name: string;
  source?: string;
  serving_size_string: string;
  nutrients: MacroNutrientTypes;
  number_of_servings: number;
  serving_quantity: number;
}

export interface MainMeal {
  name: string;
  meals: (SupabaseIngredient | SupabaseRecipe)[];
  uid: string;
}

export interface MacroNutrientTypes {
  salt_serving?: number;
  sodium_serving?: number;
  ['energy-kcal_serving']?: number;
  carbohydrates_serving?: number;
  fat_serving?: number;
  protein_serving?: number;
  [index: string]: number | undefined;
}

export interface Day {
  day_name: string;
  order: number;
  main_meals: MainMeal[];
  nutrients?: MacroNutrientTypes;
  uid: string;
}

export interface SelectedMealNumberProps {
  name: string;
  meals: (SupabaseIngredient | SupabaseRecipe)[];
  uid: string;
}

export interface StrippedSingleIngredient {
  id: number;
  amount: number;
  uid: string;
  thumnail: string | null;
  product_name: string;
  barcode: number | null;
  number_of_servings: number;
  serving_quantity: number;
  serving_size_string: string;
  popularity: number;
  nutrients: {
    'energy-kcal_serving': number;
  };
}

export interface UserPublic {
  id: string;
  username: string;
  full_name: string;
  verified: boolean;
  avatar_url: string;
  avatar_url_150x150: string;
  avatar_url_320x320: string;
}

export interface UserPrivate {
  id: string;
  full_name: string;
  // public_info?: UserPublic;
  avatar_url: string;
  email: string;
  goal_calories: number;
  goal_carbs: number;
  goal_fats: number;
  goal_protein: number;
  onboarding_completed: boolean;
  billing_address?: Stripe.Address;
  payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
}

export interface FilterProps {
  calories: number[];
  carbs: number[];
  fats: number[];
  protein: number[];
}

export interface GoalMacros {
  goal_calories: number;
  goal_carbs: number;
  goal_fats: number;
  goal_protein: number;
}
export interface SupabaseIngredient {
  id: number;
  created_at?: string;
  created_by?: string;
  product_name: string;
  barcode?: number | null;
  number_of_servings: number;
  serving_quantity: number;
  serving_size_string: string;
  popularity?: number | null;
  nutrients: MacroNutrientTypes;
  image_url: string | null;
  thumbnail_url: string | null;
  source: string;
  amount: number;
  food_portions?:
    | {
        id: number;
        gramWeight: number;
        modifier: string;
        sequenceNumber?: number;
      }[]
    | null;
  uid: string;
}

export interface SupabaseRecipe {
  id: number;
  product_name: string;
  tags: string[] | null;
  nutrients: MacroNutrientTypes;
  ingredients: SupabaseIngredient[];
  parent_recipe_id?: number;
  instructions: string;
  // TODO: FIX THIS EVERYWHERE!
  image_url: string | null;
  thumbnail_url: string | null;
  created_by: string;
  created_at?: string;
  uid: string;
}

export interface SupabaseRecipeConvertedForStretching {
  id: number;
  product_name: string;
  tags: string[];
  nutrients: MacroNutrientTypes;
  instructions: string;
  image_url: string;
  thumbnail_url: string;
  created_by: string;
  created_at: string;
  uid: string;
  ingredients: IngredientForStretching[];
}

export interface IngredientForStretching {
  order_number: number;
  increment_size: number;
  max_amount: number;
  checked: boolean;
  id: number;
  created_at?: string;
  created_by?: string;
  product_name: string;
  barcode?: number | null;
  number_of_servings: number;
  serving_quantity: number;
  serving_size_string: string;
  popularity?: number | null;
  nutrients: MacroNutrientTypes;
  image_url: string | null;
  thumbnail_url: string | null;
  source: string;
  amount: number;
  food_portions?:
    | {
        id: number;
        gramWeight: number;
        modifier: string;
        sequenceNumber?: number;
      }[]
    | null;
  uid: string;
}

export interface RecipeForStretching {
  parent_recipe_id: number;
  popularity_score?: number;
  tags: string[] | null;
  nutrients: MacroNutrientTypes;
  ingredients: IngredientForStretching[];
  // number_of_ingredients: number;
  id: number;
  product_name: string;
  instructions: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  created_by: string;
  created_at?: string;
}

export interface ShoppingListItem {
  product_name: string;
  amount?: number;
  checked: boolean;
  number_of_items?: number;
}

export interface PricingOptions {
  billingPeriod: 'Monthly' | 'Yearly';
  priceId: string;
  priceString: string;
  billingString: string;
  badgeText: string;
  badgeClassName: string;
  crossedText: string;
  leftLabel: string;
}

export interface IngredientAmount {
  amount: number;
  ingredient_id: number;
  serving_quantity: number;
  number_of_servings: number;
  serving_size_string: string;
}
