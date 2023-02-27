import * as Yup from 'yup';

export const createNewFormSchema = Yup.object().shape({
  formName: Yup.string().required('Form name required'),
  redirectUrl: Yup.string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Enter correct url!'
    )
    .required('Please enter redirection url'),
  buttonText: Yup.string().required('Button text required'),
  buttonTheme: Yup.string().required('Button theme required')
});
