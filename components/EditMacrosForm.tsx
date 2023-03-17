// Will have to check this because don't really know what is going on here, but it works.

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { supabase } from '@/utils/supabase-client';
import AppBarBackUniversal from './Navigation/AppBarBackUniversal';
import toast from 'react-hot-toast';
import GetMoreHelp from './GetMoreHelp';
import { useUser } from '@/utils/useUser';

const schema = yup
  .object()
  .shape({
    calories: yup.number().required().min(1500),
    carbsPercentage: yup.number().required().min(10),
    fatsPercentage: yup.number().required().min(10),
    proteinPercentage: yup.number().required().min(10)
  })
  .required();

function EditMacrosForm({
  goalCalories,
  carbsPercentage,
  fatsPercentage,
  proteinPercentage
}: {
  goalCalories: number;
  carbsPercentage: number;
  fatsPercentage: number;
  proteinPercentage: number;
}) {
  const { user, isLoading } = useUser();

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    register
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      calories: goalCalories,
      carbsPercentage: carbsPercentage,
      fatsPercentage: fatsPercentage,
      proteinPercentage: proteinPercentage
    },
    resolver: yupResolver(schema)
  });

  // check if watch('carbsPercentage') is string then convert to number otherwise return watch('carbsPercentage')
  const carbsPercentageParsed =
    typeof watch('carbsPercentage') === 'string'
      ? Number(watch('carbsPercentage'))
      : watch('carbsPercentage');
  const fatsPercentageParsed =
    typeof watch('fatsPercentage') === 'string'
      ? Number(watch('fatsPercentage'))
      : watch('fatsPercentage');
  const proteinPercentageParsed =
    typeof watch('proteinPercentage') === 'string'
      ? Number(watch('proteinPercentage'))
      : watch('proteinPercentage');
  const caloriesParsed =
    typeof watch('calories') === 'string'
      ? Number(watch('calories'))
      : watch('calories');

  const totalPercentage =
    carbsPercentageParsed + fatsPercentageParsed + proteinPercentageParsed;

  const getGramValues = () => {
    const carbsPercentageDecimal = carbsPercentageParsed / 100 || 0;
    const fatsPercentageDecimal = fatsPercentageParsed / 100 || 0;
    const proteinPercentageDecimal = proteinPercentageParsed / 100 || 0;

    const carbsGrams = (caloriesParsed * carbsPercentageDecimal) / 4;
    const fatsGrams = (caloriesParsed * fatsPercentageDecimal) / 9;
    const proteinGrams = (caloriesParsed * proteinPercentageDecimal) / 4;

    return {
      carbsGrams,
      fatsGrams,
      proteinGrams
    };
  };

  const { carbsGrams, fatsGrams, proteinGrams } = getGramValues();

  const onSubmit = handleSubmit(async (data) => {
    if (user) {
      if (totalPercentage != 100) {
        toast.error('Total percentage must be 100%');
      } else {
        const { data: updateSuccess, error: updateError } = await supabase
          .from('users')
          .update({
            id: user.id,
            goal_calories: data.calories,
            goal_carbs: carbsGrams,
            goal_fats: fatsGrams,
            goal_protein: proteinGrams
          })
          .select();

        if (updateError) {
          toast.error('Error updating macros, please try again');
        }
        if (updateSuccess) {
          toast.success('Macros updated!');
          alert('Macros updated!');
        }
      }
    }
  });

  return (
    <div className="flex flex-col h-full min-h-screen safeAreaInset">
      <AppBarBackUniversal pageTitle="Edit Goal Macros" />
      <form className="flex flex-col h-full" onSubmit={onSubmit}>
        <div className="flex w-full flex-col p-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Enter your goal calories</span>
            </label>
            <label className="input-group">
              <input
                type="number"
                placeholder=""
                className="input input-bordered text-center"
                onKeyPress={(e) => {
                  if (e.key === 'e' || e.key === '-' || e.key === '.') {
                    e.preventDefault();
                  }
                }}
                {...register('calories', {
                  required: 'Carbs percentage is required'
                })}
              />
              <span>kcal</span>
            </label>
          </div>

          <div className="flex flex-col py-4">
            <div className="flex w-fu gap-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Carbs</span>
                </label>
                <label className="input-group">
                  <input
                    type="number"
                    placeholder=""
                    className="input input-bordered text-center"
                    onKeyPress={(e) => {
                      if (e.key === 'e' || e.key === '-' || e.key === '.') {
                        e.preventDefault();
                      }
                    }}
                    {...register('carbsPercentage', {
                      required: 'Carbs percentage is required'
                    })}
                  />
                  <span>%</span>
                </label>
                <p className="text-sm">{carbsGrams.toFixed()}g carbs</p>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Fats</span>
                </label>
                <label className="input-group">
                  <input
                    type="number"
                    placeholder=""
                    className="input input-bordered text-center"
                    {...register('fatsPercentage', {
                      required: 'Fats percentage is required'
                    })}
                    onKeyPress={(e) => {
                      if (e.key === 'e' || e.key === '-' || e.key === '.') {
                        e.preventDefault();
                      }
                    }}
                  />
                  <span>%</span>
                </label>
                <p className="text-sm">{fatsGrams.toFixed()}g fats</p>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Protein</span>
                </label>
                <label className="input-group">
                  <input
                    type="number"
                    placeholder=""
                    className="input input-bordered text-center"
                    {...register('proteinPercentage', {
                      required: 'Protein percentage is required'
                    })}
                    onKeyPress={(e) => {
                      if (e.key === 'e' || e.key === '-' || e.key === '.') {
                        e.preventDefault();
                      }
                    }}
                  />
                  <span>%</span>
                </label>
                <p className="text-sm">{proteinGrams.toFixed()}g protein</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pb-4">
            <p className="text-center text-sm text-gray-400">
              Macronutrients must equal 100%
            </p>
            <p
              className={`text-center font-semibold ${
                totalPercentage !== 100 && 'text-red-600'
              }`}
            >
              Total: {totalPercentage}%
            </p>
          </div>
        </div>
      </form>

      <div className="p-2 sticky bottom-0 mt-auto flex flex-col gap-4">
        {/* <GetMoreHelp /> */}
        <button
          type="submit"
          className="w-full bg-cyan-400 text-white h-12 rounded-md font-semibold"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default EditMacrosForm;
