import {
  addNewFieldToSelectedStep,
  FormConfigInterface
} from '@/utils/features/formConfigSlice';
import { changeModalForAddNewFormStepStatus } from '@/utils/features/modalStateSlice';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';

export default function AddNewFormStep({
  selectedStepIndex
}: {
  selectedStepIndex: number | null;
}) {
  const dispatch = useAppDispatch();
  const formConfiguration = useAppSelector((state) => state.formConfig);
  const formConfigurations = [
    {
      componentName: 'fullName',
      description: 'Full Name of the user',
      input: 'text',
      labelText: "What's your name?"
    },
    {
      componentName: 'address',
      description: 'Address of the user city, country'
    },
    {
      componentName: 'email',
      description: 'Email of the user',
      input: 'email',
      labelText: "What's your best email?"
    },
    {
      componentName: 'dob',
      description: 'Date of Birth of the user'
    },
    {
      componentName: 'sex',
      description: 'sex of the user (male or female)'
    },
    {
      componentName: 'fitnessGoal',
      description:
        'Fitness Goal of the user (Lose Weight, Gain Weight, Maintain Weight)'
    },
    {
      componentName: 'activityLevel',
      description:
        'Activity Level of the user (Sedentary, lightly active, active, very active)'
    },
    {
      componentName: 'phoneNumber',
      description: 'Phone Number of the user including country code'
    },
    {
      componentName: 'occupation',
      description: 'Occupation of the user',
      input: 'text',
      labelText: "What's your occupation?"
    },
    {
      componentName: 'custom',
      description: 'Create your own question of what you want to ask'
    },
    {
      componentName: 'currentWeight',
      description: 'Current Weight of the user'
    },
    {
      componentName: 'goalWeight',
      description: 'Goal Weight of the user'
    },
    {
      componentName: 'goalDate',
      description: 'Goal Date of the user'
    },
    {
      componentName: 'motivation',
      description: 'Motivation of the user, why they want to start?'
    },
    {
      componentName: 'importance',
      description:
        'How important is it for the user to achieve their goal? (1-10)'
    }
  ];

  const onClose = () => {
    dispatch(changeModalForAddNewFormStepStatus(false));
  };

  console.log(
    '🚀 ~ file: AddNewFormStep.tsx ~ line 68 ~ AddNewFormStep ~ modalState'
  );

  return (
    <Dialog className="fixed inset-0 z-10" onClose={onClose} open={true}>
      <div className="flex flex-col justify-center h-full px-1 pt-4 text-center sm:block sm:p-0">
        <Dialog.Overlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.4, ease: [0.36, 0.66, 0.04, 1] }
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] }
          }}
          className="fixed inset-0 bg-black/40"
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{
            y: 0,
            transition: { duration: 0.4, ease: [0.36, 0.66, 0.04, 1] }
          }}
          exit={{
            y: '100%',
            transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] }
          }}
          className="z-0 flex flex-col w-full h-full bg-white rounded-t-lg shadow-xl max-w-2xl mx-auto overflow-auto p-2"
        >
          <button
            className="mr-1 mb-6 text-blue-500 focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
          <div className="flex flex-col gap-2">
            {formConfigurations.map((formConfig, index) => (
              <div
                onClick={() => {
                  const formConfigToBeAdded: FormConfigInterface = {
                    order_number:
                      formConfiguration[selectedStepIndex!].fields.length + 1,
                    component: formConfig.componentName
                  };
                  dispatch(
                    addNewFieldToSelectedStep({
                      stepIndex: selectedStepIndex!,
                      field: formConfigToBeAdded
                    })
                  );
                  dispatch(changeModalForAddNewFormStepStatus(false));
                }}
                key={formConfig.componentName}
                className="flex flex-col items-start justify-center w-full h-20 p-4 ring-1 ring-gray-200 rounded-xl"
              >
                <p className="text-lg font-semibold text-gray-700">
                  {formConfig.componentName}
                </p>
                <p className="text-sm text-gray-500 text-left">
                  {formConfig.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
}
