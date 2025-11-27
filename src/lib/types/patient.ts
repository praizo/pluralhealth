export interface Patient {
  _id: string;
  hospitalId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  title: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  phoneNumber: string;
  isNew: boolean;
  picture?: string;
  fingerprint?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePatientInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  title: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  phoneNumber: string;
  isNew: boolean;
  picture?: string;
  fingerprint?: string;
}