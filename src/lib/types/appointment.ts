export type AppointmentStatus =
  | 'Processing'
  | 'Not arrived'
  | 'Awaiting vitals'
  | 'Awaiting doctor'
  | 'Admitted to ward'
  | 'Transferred to A&E'
  | 'Seen doctor';

export type AppointmentType = 'New' | 'Follow-up' | 'Emergency' | 'Walk-in' | 'Referral' | 'Consult' | 'Medical Exam';

export interface Appointment {
  _id: string;
  patientId: string;
  patient?: {
    firstName: string;
    lastName: string;
    hospitalId: string;
    gender: string;
    age: string;
    isNew?: boolean;
  };
  clinic: string;
  title: string;
  scheduledTime: Date;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  amount: number;
  doesNotRepeat: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentRow {
  id: string;
  patient: {
    name: string;
    hospitalId: string;
    gender: string;
    age: string;
    avatarColor: string;
  };
  isNew?: boolean;
  hasRecord?: boolean;
  clinic: {
    name: string;
    extra?: number;
  };
  walletBalance: number;
  scheduledTime: string;
  scheduledDate: string;
  status: AppointmentStatus;
}


export interface CreateAppointmentInput {
  patientId: string;
  clinic: string;
  title: string;
  scheduledTime: Date;
  appointmentType: AppointmentType;
  doesNotRepeat: boolean;
}