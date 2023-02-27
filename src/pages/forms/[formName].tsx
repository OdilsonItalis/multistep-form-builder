import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { FaPlus } from 'react-icons/fa';

import NewFormControlsNav from '../../components/NewFormControlsNav';
import Button from '../../components/FormMaterials/Button';

export default function CustomForm() {
  const { selectedForm } = useSelector((state) => state.formsReducer);

  const [formSteps, setFormSteps] = useState<number>(1);
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [formData, setFormData] = useState();
  console.log('==================>>>>', formData);

  useEffect(() => {
    if (selectedForm.formName) {
      setFormData({
        ...selectedForm,
        steps: Array.from(Array(formSteps).keys()).map((item) => {
          return {
            step: item,
            materials: []
          };
        })
      });
    } else {
      Router.push({
        pathname: '/'
      });
    }
  }, [selectedForm]);
  return (
    <div className="py-6 px-8">
      {formData && (
        <>
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
              className="ml-4 flex items-center text-blue-500 font-medium"
              onClick={() => {
                setFormSteps(formSteps + 1);
              }}
            >
              <FaPlus className="mr-1" />
              Add new step
            </button>
          </div>
          <div className="flex items-start mt-8">
            <NewFormControlsNav formData={formData} setFormData={setFormData} />
            <div className="flex-1 flex flex-col justify-center items-center">
              <p className="text-[14px] font-medium mb-4">Preview</p>
              <div
                className="w-[400px] rounded-sm border border-gray-300 border-solid"
                style={{ background: `url(${formData.background})` }}
              >
                <form
                  className={classNames(
                    'p-2 flex flex-col w-full h-full items-center',
                    {
                      'text-white': formData.textColor
                    }
                  )}
                >
                  <h4 className="font-medium text-[18px] my-3">
                    {formData?.formName}
                  </h4>
                  <Button
                    classes="self-end w-full mt-auto"
                    themeColor={formData?.buttonTheme}
                    leftArrow
                  >
                    {formData?.buttonText}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
