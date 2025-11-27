import * as Yup from 'yup';

export const patientValidationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  dateOfBirth: Yup.date().required('Date of birth is required'),
  gender: Yup.string().oneOf(['Male', 'Female', 'Other'], 'Invalid gender').required('Gender is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  title: Yup.string(),
  middleName: Yup.string(),
});
