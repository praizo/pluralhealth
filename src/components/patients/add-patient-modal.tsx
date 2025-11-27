'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { CreatePatientInput } from '@/lib/types/patient';
import { useCreatePatient } from '@/lib/hooks/use-patients';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { patientValidationSchema } from '@/lib/schemas/patient';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddPatientModal({ isOpen, onClose, onSuccess }: AddPatientModalProps) {
  const createPatientMutation = useCreatePatient();

  const initialValues: CreatePatientInput = {
    firstName: '',
    middleName: '',
    lastName: '',
    title: '',
    dateOfBirth: new Date(),
    gender: 'Male',
    phoneNumber: '',
    isNew: true,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add new patient"
      description="Fill in the patient information in the fields provided below"
      className="max-w-[900px] w-[95vw] sm:w-full"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={patientValidationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const submissionData = {
            ...values,
            dateOfBirth: new Date(values.dateOfBirth)
          };

          createPatientMutation.mutate(submissionData, {
            onSuccess: () => {
              toast.success('Patient created successfully');
              onSuccess?.();
              onClose();
              resetForm();
            },
            onError: (error) => {
              console.error('Failed to create patient:', error);
              toast.error('Failed to create patient');
            },
            onSettled: () => {
              setSubmitting(false);
            }
          });
        }}
      >
        {({ isSubmitting, values, setFieldValue, touched, errors }) => (
          <Form className="space-y-8">
            {/* Top Section: Avatar & ID */}
            <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col lg:flex-row items-center gap-3 w-full lg:w-auto">
                <div className="w-24 h-24 rounded-full bg-[#D0D5DD] flex items-center justify-center text-white overflow-hidden">
                  <Image src="/images/user-placeholder-large.svg" alt="User Placeholder" width={48} height={48} className="text-white" />
                </div>
                <div className="flex flex-col   gap-4">
                  <div className="flex flex-col md:flex-row gap-2">
                    <Button type="button" className="px-4 py-2 text-sm rounded-lg w-full sm:w-auto justify-center">
                      Take patient&apos;s picture
                      <Image src="/images/down-small.svg" alt="Chevron Down" width={16} height={16} />
                    </Button>
                    <Button type="button" className="px-4 py-2 text-sm rounded-lg w-full sm:w-auto justify-center">
                      Add fingerprint
                      <Image src="/images/fingerprint.svg" alt="Fingerprint" width={16} height={16} className="brightness-0 invert" />
                    </Button>
                  </div>
                  <p className="text-base font-medium leading-[100%] text-[#7A90C2] text-left lg:text-left max-w-md lg:max-w-none">
                    Patient picture should be updated by reception personnel
                  </p>
                </div>
              </div>

              {/* Patient ID Section */}
              <div className="flex-1 flex flex-col items-start lg:items-end gap-2 w-full">
                <div className="bg-[#D7E3FC] border border-[#EFF1F4] rounded-lg p-2 flex items-start gap-2 w-full lg:max-w-xs">
                  <div className="bg-[#FF8B00] rounded text-white p-0.5 mt-0.5 shrink-0">
                    <Image src="/images/info.svg" alt="infohh" width={12} height={12} />
                  </div>
                  <p className="text-[10px] text-[#051438] leading-tight">
                    If there is an existing Patient ID, input the patient&apos;s existing ID into the field
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full justify-start lg:justify-end">
                  <div className="relative w-full lg:w-40">
                    <input
                      type="text"
                      defaultValue="HOSP98765433"
                      className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-[#051438] font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#D7E3FC] cursor-pointer"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Image src="/images/info-circle.svg" alt="Info" width={16} height={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6 relative">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-1">
                  <Field
                    as="select"
                    name="title"
                    className="w-full px-2 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7E3FC] cursor-pointer"
                  >
                    <option value="">Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                  </Field>
                </div>
                <div className="md:col-span-3">
                  <Field
                    name="firstName"
                    placeholder="First name *"
                    className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7E3FC] cursor-pointer ${touched.firstName && errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="md:col-span-4">
                  <Field
                    name="middleName"
                    placeholder="Middle name"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7E3FC] cursor-pointer"
                  />
                </div>
                <div className="md:col-span-4">
                  <Field
                    name="lastName"
                    placeholder="Last name *"
                    className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7E3FC] cursor-pointer ${touched.lastName && errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <DatePicker
                    selected={values.dateOfBirth ? new Date(values.dateOfBirth) : null}
                    onChange={(date) => setFieldValue('dateOfBirth', date)}
                    placeholderText="Date of birth *"
                    className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7E3FC] cursor-pointer ${touched.dateOfBirth && errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                    wrapperClassName="w-full"
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    minDate={new Date()}
                  />
                  <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-xs mt-1" />

                </div>
                <div className="md:col-span-4">
                  <Field
                    as="select"
                    name="gender"
                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7E3FC] cursor-pointer bg-white ${touched.gender && errors.gender ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Gender *</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Field>
                  <ErrorMessage name="gender" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="md:col-span-4">
                  <Field
                    name="phoneNumber"
                    placeholder="Phone number *"
                    className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7E3FC] cursor-pointer ${touched.phoneNumber && errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-end gap-2">
                <span className="text-sm font-medium text-[#051438]">Is patient new to the hospital?</span>
                <div
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${values.isNew ? 'bg-[#0B0C7D]' : 'bg-gray-200'}`}
                  onClick={() => setFieldValue('isNew', !values.isNew)}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${values.isNew ? 'left-6.5' : 'left-0.5'}`}></div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 md:pt-32">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="px-6 py-2.5 rounded-lg w-full sm:w-auto"
              >
                Save & close
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg w-full sm:w-auto"
              >
                {isSubmitting ? 'Adding...' : 'Add New Patient'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}