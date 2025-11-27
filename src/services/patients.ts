import { API_BASE } from '@/lib/constants/api';
import { CreatePatientInput, Patient } from '@/lib/types/patient';

export const patientService = {
  getAll: async (): Promise<Patient[]> => {
    const response = await fetch(`${API_BASE}/patients`);
    if (!response.ok) throw new Error('Failed to fetch patients');
    return response.json();
  },

  getById: async (id: string): Promise<Patient> => {
    const response = await fetch(`${API_BASE}/patients/${id}`);
    if (!response.ok) throw new Error('Failed to fetch patient');
    return response.json();
  },

  create: async (data: CreatePatientInput): Promise<Patient> => {
    const response = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create patient');
    return response.json();
  },

  search: async (query: string): Promise<Patient[]> => {
    const response = await fetch(`${API_BASE}/patients/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search patients');
    return response.json();
  }
};
