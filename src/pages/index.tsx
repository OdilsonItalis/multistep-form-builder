import React from 'react';
import { Formik } from 'formik';
import Router from 'next/router';
import { useDispatch } from 'react-redux';

import Button from '../components/FormMaterials/Button';
import FormLabel from '../components/FormMaterials/FormLabel';
import FormInput from '../components/FormMaterials/FormInput';

import { createNewFormSchema } from '../utils/formValidationSchemas';
import useToastMessage from '../hooks/toastMessage';
import { createNewForm } from '../store/slices/formsSlice';

export default function CreateNewFormPage() {
  const { showSuccess } = useToastMessage();
  const dispatch = useDispatch();

  const colors = {
    purple: '#cc66ff',
    black: '#000000',
    pink: '#ff66ff',
    green: '#009933'
  };
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Formik
        initialValues={{
          formName: '',
          redirectUrl: '',
          buttonText: '',
          buttonTheme: ''
        }}
        validationSchema={createNewFormSchema}
        onSubmit={(values) => {
          showSuccess(`New form ${values.formName} created successfully!`);
          dispatch(createNewForm(values));
          Router.push({
            pathname: `/forms/${values.formName}`
          });
        }}
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
          <form className="flex flex-col w-[350px]" onSubmit={handleSubmit}>
            <Button type="submit" classes="self-end" disabled={isSubmitting}>
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
              <div className="flex flex-col w-[48%]">
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
              <div className="flex flex-col w-[48%]">
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
              <div className="flex flex-col w-[48%]">
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
              <div className="flex flex-col w-[48%]">
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
    </div>
  );
}
