import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { FaPlus, FaTimes } from 'react-icons/fa';

import NewFormControlsNav from '../../components/NewFormControlsNav';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import CreateNewMaterialModal from '../../components/Modals/CreateNewMaterialModal';
import ResultForm from '../../components/ResultForm';
import EditMaterialNav from '../../components/EditMaterialsNav';

export default function CustomForm() {
  const { selectedForm } = useSelector((state: any) => state.formsReducer);

  const [formSteps, setFormSteps] = useState<number>(1);
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [formData, setFormData] = useState<any>();
  const [resetNumber, setResetNumber] = useState<number>(0);

  const [isStepDelConfirmationOpen, setIsStepDelConfirmationOpen] =
    useState(false);
  const [isRefreshModalOpen, setIsRefreshModalOpen] = useState<boolean>(false);
  const [createNewMaterialModalOpen, setCreateNewMaterialModalOpen] =
    useState<boolean>(false);
  const [selectedMaterialEdit, setSelectedMaterialEdit] = useState<any>();

  useEffect(() => {
    if (selectedMaterialEdit) {
      let updatedSteps = [...formData.steps];
      formData.steps[selectedStep - 1].materials[selectedMaterialEdit.order] =
        selectedMaterialEdit;

      setFormData({ ...formData, steps: updatedSteps });
    }
  }, [selectedMaterialEdit]);

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
    <div className="py-6 px-8 h-screen w-screen flex flex-col relative overflow-hidden">
      {formData && (
        <>
          <div className="flex items-center mb-8">
            {Array.from(Array(formSteps).keys()).map((item) => (
              <button
                key={item}
                className={classNames(
                  'py-2 px-6 mr-2 font-medium text-[14px] border-2 border-solid border-gray-200 text-gray-700 rounded-md relative group',
                  {
                    'border-violet-600': selectedStep === item + 1
                  }
                )}
                onClick={() => setSelectedStep(item + 1)}
              >
                Step {item + 1}
                {formSteps > 1 && (
                  <span
                    className="p-[2px] duration-[0.1s] -mt-[5px] -mr-[5px] absolute top-0 right-0 text-[10px] rounded-full text-white bg-gray-600 hidden group-hover:flex"
                    onClick={() => setIsStepDelConfirmationOpen(true)}
                  >
                    <FaTimes />
                  </span>
                )}
              </button>
            ))}

            <button
              className="ml-4 flex items-center text-blue-500 font-medium hover:text-blue-400 duration-[0.2s]"
              onClick={() => {
                const newFormStep = formSteps + 1;
                setFormSteps(newFormStep);
                setFormData({
                  ...formData,
                  steps: [
                    ...formData.steps,
                    {
                      step: newFormStep,
                      materials: []
                    }
                  ]
                });
              }}
            >
              <FaPlus className="mr-1" />
              Add new step
            </button>
          </div>

          <div className="flex items-start flex-1">
            <NewFormControlsNav
              resetNumber={resetNumber}
              formData={formData}
              setFormData={setFormData}
              openCreateNewMaterialModal={() =>
                setCreateNewMaterialModalOpen(true)
              }
              selectedStep={selectedStep}
              setSelectedMaterialEdit={setSelectedMaterialEdit}
              selectedMaterialEdit={selectedMaterialEdit}
            />

            <div
              className={classNames(
                'flex-1 flex flex-col justify-center items-center duration-[0.2s]',
                {
                  'mr-[350px]': !!selectedMaterialEdit
                }
              )}
            >
              <p className="text-[14px] font-medium mb-4">Preview</p>
              <div
                className="w-[400px] h-[757px] bg-cover overflow-hidden relative flex items-center justify-center"
                style={{
                  background: "url('/images/mobile_resemble.png')",
                  backgroundSize: 'cover'
                }}
              >
                <div
                  className="absolute top-0 pt-8 mr-[2px] w-[90%] mt-[17px] h-[92.5%] rounded-tl-[40px] rounded-tr-[40px] flex flex-col items-center"
                  style={{ background: `url(${formData.background})` }}
                >
                  {formData.background && formData.background !== '' && (
                    <img
                      src="/images/mobile_resemble_top.png"
                      className="top-0 -mt-[34px] w-[58%]"
                      alt="Mobile Resemble Top"
                    />
                  )}
                  <ResultForm formData={formData} selectedForm={selectedStep} />
                </div>
              </div>
            </div>
            {formData.steps[selectedStep - 1].materials.length > 0 &&
              selectedMaterialEdit && (
                <EditMaterialNav
                  setSelectedMaterialEdit={setSelectedMaterialEdit}
                  selectedMaterialEdit={selectedMaterialEdit}
                />
              )}
          </div>
        </>
      )}

      <ConfirmationModal
        isOpen={isStepDelConfirmationOpen}
        closeModal={() => setIsStepDelConfirmationOpen(false)}
        onSubmit={() => {
          setFormSteps(formSteps - 1);
          setIsStepDelConfirmationOpen(false);
          setSelectedStep(1);
        }}
      />

      <ConfirmationModal
        isOpen={isRefreshModalOpen}
        closeModal={() => setIsRefreshModalOpen(false)}
        title="Are you sure you want to refresh form data?"
        subTitle="Your changes may not be saved!"
        onSubmit={() => {
          setFormSteps(1);
          setSelectedStep(1);
          setFormData({
            ...selectedForm,
            steps: Array.from(Array(formSteps).keys()).map((item) => {
              return {
                step: item,
                materials: []
              };
            })
          });
          setResetNumber(resetNumber + 1);
          setIsRefreshModalOpen(false);
        }}
      />

      <CreateNewMaterialModal
        isOpen={createNewMaterialModalOpen}
        closeModal={() => {
          setCreateNewMaterialModalOpen(false);
        }}
        setFormData={setFormData}
        formData={formData}
        selectedStep={selectedStep}
      />

      <button
        className="absolute bg-white bottom-[40px] right-[40px] z-50 w-[70px] hover:w-[150px] py-2 px-4 duration-[0.4s] group flex items-center hover:border border-solid border-gray-300 overflow-hidden rounded-md hover:shadow-md"
        onClick={() => setIsRefreshModalOpen(true)}
      >
        <img
          src="/images/icons/refresh.svg"
          className="w-[38px]"
          alt="Refresh Icon"
        />
        <p className="hidden whitespace-nowrap ml-2 font-medium text-[18px] group-hover:flex w-[0px] group-hover:w-[75px] duration-[0.6s] text-gray-600">
          Reset All
        </p>
      </button>
    </div>
  );
}
