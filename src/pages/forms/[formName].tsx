import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { FaPlus } from 'react-icons/fa';

import NewFormControlsNav from '../../components/NewFormControlsNav';

import { RootState } from '../../store/store';

export default function CustomForm() {
  const formsReducer = useSelector((state: RootState) => state.formsReducer);

  const [formSteps, setFormSteps] = useState<number>(1);
  const [selectedStep, setSelectedStep] = useState<number>(1);
  return (
    <div className="py-6 px-8">
      <div className="flex items-center">
        {Array.from(Array(formSteps).keys()).map((item) => (
          <button
            key={item}
            className={classNames(
              'py-2 px-6 mr-2 font-medium text-[14px] border-2 border-solid border-gray-200 text-gray-700 rounded-md',
              {
                'border-violet-600': selectedStep === item + 1
              }
            )}
            onClick={() => setSelectedStep(item + 1)}
          >
            Step {item + 1}
          </button>
        ))}
        <button
          className="ml-4 flex items-center text-blue-500"
          onClick={() => setFormSteps(formSteps + 1)}
        >
          <FaPlus className="mr-1" />
          Add new step
        </button>
      </div>
      <div className="flex items-start mt-8">
        <NewFormControlsNav />
      </div>
    </div>
  );
}
