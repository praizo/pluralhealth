export const CLINICS = [
  "Accident and Emergency",
  "Neurology",
  "Cardiology",
  "Gastroenterology",
  "Renal"
];

export const APPOINTMENT_TYPE_GROUPS = [
  {
    title: 'New (Walk-in, Referral, Consult)',
    items: [
      { label: 'Walk-in', value: 'Walk-in', type: 'Walk-in' },
      { label: 'Referral', value: 'Referral', type: 'Referral' },
      { label: 'Consult', value: 'Consult', type: 'Consult' },
    ]
  },
  {
    title: 'Follow-up',
    items: [
      { label: 'Follow-up', value: 'Follow-up', type: 'Follow-up' }
    ]
  },
  {
    title: 'For Medical Exam',
    items: [
      { label: 'For Medical Exam', value: 'Medical Exam', type: 'Medical Exam' }
    ]
  }
];
