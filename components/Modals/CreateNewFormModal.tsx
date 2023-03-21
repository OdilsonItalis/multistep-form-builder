import React from 'react';
import { Formik } from 'formik';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

import Button from '@/components/FormBuilder/FormMaterials/Button';
import FormLabel from '@/components/FormBuilder/FormMaterials/FormLabel';
import FormInput from '@/components/FormBuilder/FormMaterials/FormInput';

import { createNewFormSchema } from '@/utils/formSchemas/formValidationSchemas';
import { changeCreateNewFormModalStatus } from '@/utils/features/modalStateSlice';
import { useAppDispatch } from '@/utils/hooks/rtkhooks';

interface FormData {
  formName: string;
  redirectUrl: string;
  buttonText: string;
  buttonTheme: string;
}

interface ModalProps {
  createNewForm: (formData: FormData) => void;
}
export default function CreateNewFormModal({ createNewForm }: ModalProps) {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(changeCreateNewFormModalStatus(false));
  };

  const colors = {
    purple: '#cc66ff',
    black: '#000000',
    pink: '#ff66ff',
    green: '#009933'
  };

  return (
    <Dialog className="fixed inset-0 z-10" onClose={handleClose} open={true}>
      <div className="flex flex-col justify-center h-full px-1 pt-4">
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
          className="z-0 flex pt-6 flex-col w-full bg-white rounded-lg shadow-xl px-6 max-w-2xl mx-auto relative"
        >
          <FaTimes
            onClick={handleClose}
            className="absolute top-[15px] right-[15px] text-gray-400 cursor-pointer"
          />
          <Formik
            initialValues={{
              formName: '',
              redirectUrl: '',
              buttonText: '',
              buttonTheme: ''
            }}
            validationSchema={createNewFormSchema}
            onSubmit={(values) => createNewForm(values)}
          >
            {({
              values,
              handleChange,
              setFieldValue,
              errors,
              touched,
              isSubmitting,
              handleSubmit,
              setTouched
            }) => (
              <form
                className="flex flex-col justify-start md:justify-center px-4 py-8 w-full h-full overflow-y-auto"
                onSubmit={handleSubmit}
              >
                <Button
                  type="submit"
                  classes="self-end"
                  disabled={isSubmitting}
                >
                  Create new form
                </Button>

                <FormLabel>Form Name</FormLabel>
                <FormInput
                  type="text"
                  name="formName"
                  placeholder="Enter your form name"
                  value={values.formName}
                  error={errors.formName && touched.formName}
                  onChange={handleChange}
                />
                {errors.formName && touched.formName && (
                  <span className="text-red-500 font-medium text-[14px]">
                    {errors.formName}
                  </span>
                )}

                <FormLabel>Button Theme</FormLabel>
                <div className="flex flex-wrap justify-between">
                  <div className="flex flex-col w-full md:w-[48%]">
                    <p className="pl-1">Purple</p>
                    <Button
                      classes="self-end w-full"
                      themeColor={colors.purple}
                      radioChecked={values.buttonTheme === colors.purple}
                      onClickHandler={() => {
                        setFieldValue('buttonTheme', colors.purple);
                        setTouched({ ...touched, ['buttonTheme']: false });
                      }}
                      radioCicle
                      leftArrow
                    >
                      Next
                    </Button>
                  </div>
                  <div className="flex flex-col mt-2 md:mt-0 w-full md:w-[48%]">
                    <p className="pl-1">Black</p>
                    <Button
                      classes="self-end w-full"
                      themeColor={colors.black}
                      radioChecked={values.buttonTheme === colors.black}
                      onClickHandler={() => {
                        setFieldValue('buttonTheme', colors.black);
                        setTouched({ ...touched, ['buttonTheme']: false });
                      }}
                      radioCicle
                      leftArrow
                    >
                      Next
                    </Button>
                  </div>
                  <div className="flex flex-col mt-2 md:mt-0 w-full md:w-[48%]">
                    <p className="pl-1">Pink</p>
                    <Button
                      classes="self-end w-full"
                      themeColor={colors.pink}
                      radioChecked={values.buttonTheme === colors.pink}
                      onClickHandler={() => {
                        setFieldValue('buttonTheme', colors.pink);
                        setTouched({ ...touched, ['buttonTheme']: false });
                      }}
                      radioCicle
                      leftArrow
                    >
                      Next
                    </Button>
                  </div>
                  <div className="flex flex-col mt-2 md:mt-0 w-full md:w-[48%]">
                    <p className="pl-1">Green</p>
                    <Button
                      classes="self-end w-full"
                      themeColor={colors.green}
                      radioChecked={values.buttonTheme === colors.green}
                      onClickHandler={() => {
                        setFieldValue('buttonTheme', colors.green);
                        setTouched({ ...touched, ['buttonTheme']: false });
                      }}
                      radioCicle
                      leftArrow
                    >
                      Next
                    </Button>
                  </div>
                </div>
                {errors.buttonTheme && touched.buttonTheme && (
                  <span className="text-red-500 font-medium text-[14px]">
                    {errors.buttonTheme}
                  </span>
                )}

                <FormLabel>Redirect url after user submits the form</FormLabel>
                <FormInput
                  type="text"
                  name="redirectUrl"
                  placeholder="Form submit url"
                  value={values.redirectUrl}
                  error={errors.redirectUrl && touched.redirectUrl}
                  onChange={handleChange}
                />
                {errors.redirectUrl && touched.redirectUrl && (
                  <span className="text-red-500 font-medium text-[14px]">
                    {errors.redirectUrl}
                  </span>
                )}

                <FormLabel>Form Submit button text</FormLabel>
                <FormInput
                  type="text"
                  name="buttonText"
                  placeholder="Form submit button text"
                  value={values.buttonText}
                  error={errors.buttonText && touched.buttonText}
                  onChange={handleChange}
                />
                {errors.buttonText && touched.buttonText && (
                  <span className="text-red-500 font-medium text-[14px]">
                    {errors.buttonText}
                  </span>
                )}
              </form>
            )}
          </Formik>
        </motion.div>
      </div>
    </Dialog>
  );
}
