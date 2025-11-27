import * as Yup from 'yup';

export const appointmentValidationSchema = Yup.object({
  patientId: Yup.string().required('Patient is required'),
  clinic: Yup.string().required('Clinic is required'),
  title: Yup.string().required('Appointment type is required'),
  scheduledTime: Yup.date()
    .required('Date and time is required')
    .test('future', 'Appointment time cannot be in the past', (value) => {
      if (!value) return true;
      return new Date(value) >= new Date();
    }),
});
