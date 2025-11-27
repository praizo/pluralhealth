import { GET, POST } from './route';
import { AppointmentModel } from '@/lib/db/model/appointment';
import { NextRequest } from 'next/server';

// Mock AppointmentModel
jest.mock('@/lib/db/model/appointment', () => ({
  AppointmentModel: {
    findAll: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Appointments API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return all appointments', async () => {
      const mockAppointments = [{ id: '1', title: 'Checkup' }];
      (AppointmentModel.findAll as jest.Mock).mockResolvedValue(mockAppointments);

      const response = await GET();
      const data = await response.json();

      expect(AppointmentModel.findAll).toHaveBeenCalled();
      expect(data).toEqual(mockAppointments);
      expect(response.status).toBe(200);
    });

    it('should return 500 if fetch fails', async () => {
      (AppointmentModel.findAll as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error', 'Failed to fetch appointments');
    });
  });

  describe('POST', () => {
    it('should create an appointment', async () => {
      const mockInput = {
        patientId: 'p1',
        clinic: 'General',
        scheduledTime: '2023-10-27T10:00:00Z',
        title: 'Checkup',
        appointmentType: 'Consult',
        doesNotRepeat: true,
      };
      const mockCreated = { id: '1', ...mockInput };

      (AppointmentModel.create as jest.Mock).mockResolvedValue(mockCreated);

      const request = new NextRequest('http://localhost/api/appointments', {
        method: 'POST',
        body: JSON.stringify(mockInput),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(AppointmentModel.create).toHaveBeenCalledWith(mockInput);
      expect(data).toEqual(mockCreated);
      expect(response.status).toBe(201);
    });

    it('should return 400 if required fields are missing', async () => {
      const mockInput = {
        // Missing patientId, clinic, scheduledTime
        title: 'Checkup',
      };

      const request = new NextRequest('http://localhost/api/appointments', {
        method: 'POST',
        body: JSON.stringify(mockInput),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error', 'Missing required fields');
    });

    it('should return 500 if create fails', async () => {
      const mockInput = {
        patientId: 'p1',
        clinic: 'General',
        scheduledTime: '2023-10-27T10:00:00Z',
        title: 'Checkup',
        appointmentType: 'Consult',
        doesNotRepeat: true,
      };

      (AppointmentModel.create as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const request = new NextRequest('http://localhost/api/appointments', {
        method: 'POST',
        body: JSON.stringify(mockInput),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error', 'DB Error');
    });
  });
});
