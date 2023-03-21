import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

import NewFormControlsNav from '@/components/FormBuilder/NewFormControlsNav';
import CreateNewMaterialModal from '@/components/Modals/CreateNewMaterialsModal';
import ResultForm from '@/components/FormBuilder/ResultForm';
import EditMaterialNav from '@/components/FormBuilder/EditMaterialsNav';
import ConfirmationModal from '@/components/Modals/ConfirmationModal';
import Loader from '@/components/Loader';

import useDeviceDetect from '@/utils/hooks/useDeviceDetect';
import { useGetFormById } from '@/utils/hooks/useForms';
import {
  changeStepDelConfirmationModalStatus,
  changeRefreshModalStatus,
  changeCreateNewMaterialModalStatus,
  changeSaveConfirmationModalStatus
} from '@/utils/features/modalStateSlice';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import { supabase } from '@/utils/supabase-client';

const EditFormPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id: userId, formId: id } = router.query;
  const isMobile = useDeviceDetect();
  const { data, isLoading, refetch } = useGetFormById((id || '').toString());

  const [formSteps, setFormSteps] = useState<number>(1);
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [formData, setFormData] = useState<any>(null);
  const [resetNumber, setResetNumber] = useState<number>(0);

  const [selectedMaterialEdit, setSelectedMaterialEdit] = useState<any>();
  const [selectedStepDelete, setSelectedStepDelete] = useState<number>(0);

  const [mobilePreviewOpen, setMobilePreviewOpen] = useState<boolean>(false);

  const {
    stepDelConfirmationModalOpen,
    refreshModalOpen,
    createNewMaterialModalOpen,
    saveChangesConfirmationModalOpen
  } = useAppSelector((state) => state.modalState);

  const toggleStepDelConfirmationModal = () => {
    if (stepDelConfirmationModalOpen)
      dispatch(changeStepDelConfirmationModalStatus(false));
    else dispatch(changeStepDelConfirmationModalStatus(true));
  };

  const toggleRefreshModal = () => {
    if (refreshModalOpen) dispatch(changeRefreshModalStatus(false));
    else dispatch(changeRefreshModalStatus(true));
  };

  const toggleCreateNewMaterialModal = () => {
    if (createNewMaterialModalOpen)
      dispatch(changeCreateNewMaterialModalStatus(false));
    else dispatch(changeCreateNewMaterialModalStatus(true));
  };

  const toggleSaveChangesConfirmationModal = () => {
    if (saveChangesConfirmationModalOpen)
      dispatch(changeSaveConfirmationModalStatus(false));
    else dispatch(changeSaveConfirmationModalStatus(true));
  };

  useEffect(() => {
    if (selectedMaterialEdit) {
      let updatedSteps = [...formData.form_config];
      formData.form_config[selectedStep - 1].materials[
        selectedMaterialEdit.order
      ] = selectedMaterialEdit;

      setFormData({ ...formData, form_config: updatedSteps });
    }
  }, [selectedMaterialEdit]);

  const initializeEditForm = () => {
    const dataCopy = { ...data };
    setFormData({ ...dataCopy });
    setFormSteps(dataCopy?.form_config?.length);
  };

  useEffect(() => {
    if (data?.form_name && !formData) {
      initializeEditForm();
    }
  }, [data]);

  const uploadImageToStorage = async (file: File | Blob, fileName: string) => {
    const { data, error } = await supabase.storage
      .from('form-theme-backgrounds')
      .upload(`${fileName}`, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return;
    } else {
      return `https://${process.env.NEXT_PUBLIC_SUPABASE_REFERENCE_ID}.supabase.co/storage/v1/object/public/form-theme-backgrounds/${data?.path}`;
    }
  };

  function dataURLtoFile(dataurl: string, filename: string) {
    const arr = dataurl.split(',') || [];
    const mime = arr[0].match(/:(.*?);/);
    const bstr = atob(arr[1]);
    let n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: (mime || [])[1] });
  }

  const updateForm = async () => {
    let newThemeBackgrounds;
    if (formData.form_theme_backgrounds.find((item: any) => !item.saved)) {
      newThemeBackgrounds = await formData.form_theme_backgrounds.map(
        async (item: any) => {
          if (!item.saved) {
            const file = dataURLtoFile(item.url, item.name);
            const urlPath = await uploadImageToStorage(
              file,
              `${uuidv4()}-${item.name}`
            );

            return { ...item, url: urlPath, saved: true };
          } else return item;
        }
      );
      newThemeBackgrounds = await Promise.all(newThemeBackgrounds).then(
        (value) => {
          return value;
        }
      );
    }
    const { error } = await supabase
      .from('forms')
      .update({ ...formData, form_theme_backgrounds: newThemeBackgrounds })
      .eq('id', id)
      .single();
    if (error) {
      toast.dismiss();
      toast.error(error.message);
      return;
    } else {
      toast.success('Successfully updated the form');
      toggleSaveChangesConfirmationModal();
      refetch();
      router.push(`/${userId as string}/forms`);
    }
  };
  return isLoading ? (
    <div className="h-screen w-screen flex justify-center items-center">
      <Loader />
    </div>
  ) : (
    <div
      className="py-6 px-4 md:px-8 h-screen w-screen bg-coverImportant bg-centerImportant flex flex-col relative overflow-hidden bg-gray-100"
      style={{
        background:
          formData?.background && mobilePreviewOpen && isMobile
            ? `url(${formData.background})`
            : 'url(/formBuilderBackground.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {formData &&
        (mobilePreviewOpen ? (
          <div className="h-full flex flex-col w-full">
            {isMobile && (
              <button
                onClick={() => setMobilePreviewOpen(false)}
                className="bg-blue-500 text-white text-[13px] py-2 px-3 rounded-md self-end font-medium"
              >
                Return To Edit
              </button>
            )}
            <ResultForm
              formData={formData}
              selectedForm={selectedStep}
              setSelectedStep={setSelectedStep}
            />
          </div>
        ) : (
          <>
            {isMobile && (
              <button
                onClick={() => setMobilePreviewOpen(true)}
                className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md text-[14px] self-end"
              >
                PREVIEW
              </button>
            )}
            <div className="flex items-center mb-2 md:mb-8 py-3 w-full overflow-x-auto min-h-[70px]">
              {Array.from(Array(formSteps).keys()).map((item) => (
                <button
                  key={item}
                  className={classNames(
                    'py-2 px-6 mr-2 font-medium whitespace-nowrap text-[14px] border-2 border-solid border-gray-200 text-gray-700 rounded-md relative group',
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
                      onClick={() => {
                        setSelectedStepDelete(item);
                        toggleStepDelConfirmationModal();
                      }}
                    >
                      <FaTimes />
                    </span>
                  )}
                </button>
              ))}

              <button
                className="ml-4 whitespace-nowrap flex items-center text-blue-500 font-medium hover:text-blue-400 duration-[0.2s]"
                onClick={() => {
                  const newFormStep = formSteps + 1;
                  setFormSteps(newFormStep);
                  setFormData({
                    ...formData,
                    form_config: [
                      ...formData.form_config,
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
                  toggleCreateNewMaterialModal()
                }
                selectedStep={selectedStep}
                setSelectedMaterialEdit={setSelectedMaterialEdit}
                selectedMaterialEdit={selectedMaterialEdit}
              />

              {!isMobile && (
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
                      className="absolute pt-4 top-0 mr-[2px] w-[90%] bg-coverImportant bg-centerImportant mt-[17px] h-[92.3%] rounded-tl-[40px] rounded-tr-[40px] flex flex-col items-center"
                      style={{
                        background: formData.background
                          ? `url(${formData.background})`
                          : 'white'
                      }}
                    >
                      <img
                        src="/images/mobile_resemble_top.png"
                        className="top-0 absolute w-[58%]"
                        alt="Mobile Resemble Top"
                      />
                      <ResultForm
                        formData={formData}
                        selectedForm={selectedStep}
                        setSelectedStep={setSelectedStep}
                      />
                    </div>
                  </div>
                </div>
              )}
              {formData.form_config[selectedStep - 1]?.materials.length > 0 &&
                selectedMaterialEdit && (
                  <EditMaterialNav
                    setSelectedMaterialEdit={setSelectedMaterialEdit}
                    selectedMaterialEdit={selectedMaterialEdit}
                  />
                )}
            </div>
          </>
        ))}

      {stepDelConfirmationModalOpen && (
        <ConfirmationModal
          closeModal={toggleStepDelConfirmationModal}
          onSubmit={() => {
            let deletedFormSteps = formData.form_config;
            deletedFormSteps.splice(selectedStepDelete, 1);
            setFormSteps(formSteps - 1);
            toggleStepDelConfirmationModal();
            setSelectedStep(1);
          }}
        />
      )}

      {refreshModalOpen && (
        <ConfirmationModal
          closeModal={() => toggleRefreshModal()}
          title="Are you sure you want to refresh form data?"
          subTitle="Your changes may not be saved!"
          onSubmit={() => {
            setSelectedStep(1);
            setResetNumber(resetNumber + 1);
            toggleRefreshModal();
            initializeEditForm();
          }}
        />
      )}

      {saveChangesConfirmationModalOpen && (
        <ConfirmationModal
          closeModal={() => toggleSaveChangesConfirmationModal()}
          title="Do you want to save changes?"
          subTitle="You will be redirect to see all of your forms after saving"
          onSubmit={updateForm}
        />
      )}

      {createNewMaterialModalOpen && (
        <CreateNewMaterialModal
          closeModal={() => {
            toggleCreateNewMaterialModal();
          }}
          setFormData={setFormData}
          formData={formData}
          selectedStep={selectedStep}
        />
      )}

      {!mobilePreviewOpen && (
        <div className="absolute right-[40px] bottom-[40px] flex flex-col items-center">
          <button
            data-tooltip-target="tooltip-default"
            className="bg-white z-50 relative flex items-center justify-center p-3 rounded-full shadow-md group"
            onClick={() => toggleSaveChangesConfirmationModal()}
          >
            <div className="hidden group-hover:flex text-[14px] justify-center items-center py-1 px-3 rounded-md bg-black text-white absolute whitespace-nowrap bottom-[65px]">
              Save Changes
            </div>
            <img
              src="/images/icons/save_icon.svg"
              className="w-[38px] group-hover:scale-110 duration-[0.4s]"
              alt="Save Icon"
            />
          </button>
          <button
            className="bg-white z-50 relative flex items-center justify-center p-3 rounded-full shadow-md group mt-4"
            onClick={() => toggleRefreshModal()}
          >
            <div className="hidden group-hover:flex text-[14px] justify-center items-center py-1 px-3 rounded-md bg-black text-white absolute whitespace-nowrap bottom-[65px]">
              Reset All
            </div>
            <img
              src="/images/icons/refresh_icon.svg"
              className="w-[38px] group-hover:scale-110 duration-[0.4s]"
              alt="Refresh Icon"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default EditFormPage;
