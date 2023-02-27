import * as Yup from 'yup';

export const createNewFormSchema = Yup.object().shape({
  formName: Yup.string().required('Form name required'),
  redirectUrl: Yup.string().required('Redirection url required'),
  buttonText: Yup.string().required('Button text required'),
  buttonTheme: Yup.string().required('Button theme required')
});
