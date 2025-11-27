'use client';

import { useState, useRef } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay, set } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { patientService } from '@/services/patients';
import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import { useCreateAppointment } from '@/lib/hooks/use-appointments';
import toast from 'react-hot-toast';
import { CreateAppointmentInput } from '@/lib/types/appointment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { appointmentValidationSchema } from '@/lib/schemas/appointment';
import { CLINICS, APPOINTMENT_TYPE_GROUPS } from '@/lib/constants/appointments';

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}



export function CreateAppointmentModal({ isOpen, onClose }: CreateAppointmentModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [clinicSearch, setClinicSearch] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<'clinic' | 'appointmentType' | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPatientResults, setShowPatientResults] = useState(false);
  const datePickerRef = useRef<DatePicker>(null);

  const createAppointmentMutation = useCreateAppointment();

  const { data: searchResults } = useQuery({
    queryKey: ['patients', 'search', searchQuery],
    queryFn: () => patientService.search(searchQuery),
    enabled: searchQuery.length > 3,
  });

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const startDay = getDay(startOfMonth(currentDate));
  const emptyDays = Array(startDay).fill(null);

  const initialValues: CreateAppointmentInput = {
    patientId: '',
    clinic: '',
    title: '',
    scheduledTime: new Date(),
    appointmentType: 'New',
    doesNotRepeat: true,
  };

  const handleClose = () => {
    setActiveDropdown(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add new appointment"
      className="max-w-[600px]"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={appointmentValidationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          createAppointmentMutation.mutate(values, {
            onSuccess: () => {
              toast.success('Appointment created successfully');
              onClose();
              resetForm();
              setSearchQuery('');
              setActiveDropdown(null);
            },
            onError: (error) => {
              console.error('Failed to create appointment:', error);
              toast.error('Failed to create appointment');
            },
            onSettled: () => {
              setSubmitting(false);
            }
          });
        }}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            {/* Patient Search */}
            <div className="relative">
              <div className="relative py-2">
                <input
                  type="text"
                  placeholder="Find patient by name or ID"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowPatientResults(true);
                    if (e.target.value === '') {
                      setFieldValue('patientId', '');
                    }
                  }}
                  className={`w-full pl-10 pr-10 py-3 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D7E3FC] ${touched.patientId && errors.patientId ? 'border-red-500' : 'border-gray-200'}`}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Image src="/images/search.svg" alt="Search" width={20} height={20} className="text-gray-400" />
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                  <Image src="/images/filter.svg" alt="filter" width={20} height={20} />
                </div>
              </div>
              <ErrorMessage name="patientId" component="div" className="text-red-500 text-xs mt-1" />

              {/* Search Results Dropdown */}
              {showPatientResults && searchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-10 max-h-60 overflow-y-auto">
                  {searchResults.map((patient) => (
                    <div
                      key={patient._id}
                      onClick={() => {
                        setFieldValue('patientId', patient._id);
                        setSearchQuery(`${patient.firstName} ${patient.lastName} - ${patient.hospitalId}`);
                        setShowPatientResults(false);
                      }}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0"
                    >
                      <div className="font-medium text-[#051438]">{patient.firstName} {patient.lastName}</div>
                      <div className="text-xs text-gray-500">{patient.hospitalId}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4 divide-y-2 divide-[#CDD8F3]">
              <div className="relative">
                <div
                  className="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer"
                  onClick={() => setActiveDropdown(activeDropdown === 'clinic' ? null : 'clinic')}
                >
                  <span className="text-base leading-[100%] font-medium text-[#677597]">Clinic</span>
                  <div className="flex items-center gap-2 font-semibold leading-[100%] text-base text-[#051438]">
                    {values.clinic || 'Clinic'}
                    <Image src="/images/chevron-right.svg" alt="Select" width={16} height={16} className={`transition-transform ${activeDropdown === 'clinic' ? 'rotate-90' : ''}`} />
                  </div>
                </div>
                <ErrorMessage name="clinic" component="div" className="text-red-500 text-xs" />

                {activeDropdown === 'clinic' && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-20 p-4 max-h-80 overflow-y-auto">
                    <div className="relative mb-3">
                      <input
                        type="text"
                        placeholder="Search clinic"
                        value={clinicSearch}
                        onChange={e => setClinicSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7E3FC] text-sm"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Image src="/images/search.svg" alt="Search" width={16} height={16} className="text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      {CLINICS.filter(c => c.toLowerCase().includes(clinicSearch.toLowerCase())).map(clinic => (
                        <div
                          key={clinic}
                          onClick={() => { setFieldValue('clinic', clinic); setActiveDropdown(null); }}
                          className={`p-2 hover:bg-gray-50 cursor-pointer rounded-lg font-medium text-[#051438] text-sm ${values.clinic === clinic ? 'bg-blue-50' : ''}`}
                        >
                          {clinic}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <div
                  className="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer"
                  onClick={() => setActiveDropdown(activeDropdown === 'appointmentType' ? null : 'appointmentType')}
                >
                  <span className="text-base leading-[100%] font-medium text-[#677597]">Appointment type</span>
                  <div className="flex items-center gap-2 font-semibold leading-[100%] text-base text-[#051438]">
                    {values.title || 'Appointment Type'}
                    <Image src="/images/chevron-right.svg" alt="Select" width={16} height={16} className={`transition-transform ${activeDropdown === 'appointmentType' ? 'rotate-90' : ''}`} />
                  </div>
                </div>
                <ErrorMessage name="title" component="div" className="text-red-500 text-xs" />

                {/* Appointment Type Dropdown */}
                {activeDropdown === 'appointmentType' && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-20 p-4 max-h-80 overflow-y-auto">
                    <div className="space-y-4">
                      {APPOINTMENT_TYPE_GROUPS.map((group, idx) => (
                        <div key={idx}>
                          <h3 className="text-xs font-semibold text-[#677597] uppercase mb-2">{group.title}</h3>
                          <div className="space-y-1">
                            {group.items.map(item => (
                              <div
                                key={item.value}
                                onClick={() => {
                                  setFieldValue('title', item.label);
                                  setFieldValue('appointmentType', item.type);
                                  setActiveDropdown(null);
                                }}
                                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${values.title === item.label ? 'bg-[#EBF3FF]' : 'hover:bg-gray-50'}`}
                              >
                                <span className="font-medium text-[#051438] text-sm">{item.label}</span>
                                {values.title === item.label && (
                                  <div className="text-[#0B0C7D]">
                                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M16.6666 5L7.49992 14.1667L3.33325 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between py-3  ">
                <span className="text-base leading-[100%] font-medium text-[#677597]">Time</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#051438]">{format(values.scheduledTime, 'd MMM yyyy')}</span>
                  <DatePicker
                    selected={values.scheduledTime}
                    onChange={(date) => date && setFieldValue('scheduledTime', date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    dateFormat="HH:mm"
                    className="bg-transparent border-none focus:ring-0 p-0 font-semibold text-[#051438] cursor-pointer w-[60px] text-right outline-none"
                    ref={datePickerRef}
                  />
                </div>
              </div>
              <ErrorMessage name="scheduledTime" component="div" className="text-red-500 text-xs" />
            </div>

            {/* Calendar */}
            <div className="bg-[#5B6587] rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-6">
                <button type="button" className="p-1 hover:bg-white/10 rounded cursor-pointer" title="Calendar options">
                  <Image src="/images/list.svg" alt="List" width={20} height={20} />
                </button>

                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setCurrentDate(subMonths(currentDate, 1))} title="Previous month" className="cursor-pointer">
                    <Image src="/images/chevron-left.svg" alt="Previous Month" width={20} height={20} />
                  </button>
                  <span className="font-semibold">{format(currentDate, 'MMMM yyyy')}</span>
                  <button type="button" onClick={() => setCurrentDate(addMonths(currentDate, 1))} title="Next month" className="cursor-pointer">
                    <Image src="/images/chevron-right.svg" alt="Next Month" width={20} height={20} />
                  </button>
                </div>

                <button
                  type="button"
                  className="p-1 hover:bg-white/10 rounded cursor-pointer"
                  title="Set time"
                  onClick={() => {
                    if (datePickerRef.current) {
                      datePickerRef.current.setOpen(true);
                    }
                  }}
                >
                  <Image src="/images/clock.svg" alt="Clock" width={20} height={20} />
                </button>
              </div>

              <div className="grid grid-cols-7 text-center text-xs mb-4 opacity-70">
                <div>S</div>
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
              </div>

              <div className="grid grid-cols-7 gap-y-4 text-center text-sm">
                {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
                {daysInMonth.map((day) => (
                  <button
                    key={day.toString()}
                    type="button"
                    onClick={() => {
                      const newDate = set(day, {
                        hours: values.scheduledTime.getHours(),
                        minutes: values.scheduledTime.getMinutes()
                      });
                      setFieldValue('scheduledTime', newDate);
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto transition-colors cursor-pointer
                      ${isSameDay(day, values.scheduledTime) ? 'bg-[#8B95B5] text-white font-bold' : 'hover:bg-white/10'}
                      ${!isSameMonth(day, currentDate) ? 'opacity-30' : ''}
                    `}
                  >
                    {format(day, 'd')}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-base leading-[100%] font-medium text-[#677597]">Repeat</span>
                <Field name="doesNotRepeat">
                  {({ field, form }: FieldProps) => (
                    <select
                      {...field}
                      value={field.value ? 'true' : 'false'}
                      onChange={e => form.setFieldValue('doesNotRepeat', e.target.value === 'true')}
                      className="flex items-center gap-2 font-semibold text-[#051438] bg-transparent border-none focus:ring-0 text-right cursor-pointer"
                    >
                      <option value="true">Does not repeat</option>
                      <option value="false">Repeats</option>
                    </select>
                  )}
                </Field>
              </div>

              <div className="flex md:flex-row flex-col justify-end gap-4 pt-2">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="px-6 py-2.5 rounded-lg"
                >
                  Save & Close
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-lg"
                >
                  {isSubmitting ? 'Creating...' : 'Create Appointment'}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
