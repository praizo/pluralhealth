import { GET, POST } from './route';
import { PatientModel } from '@/lib/db/model/patient';
import { NextRequest } from 'next/server';

// Mock PatientModel
jest.mock('@/lib/db/model/patient', () => ({
  PatientModel: {
    findAll: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Patients API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return all patients', async () => {
      const mockPatients = [{ id: '1', firstName: 'John' }];
      (PatientModel.findAll as jest.Mock).mockResolvedValue(mockPatients);

      const response = await GET();
      const data = await response.json();

      expect(PatientModel.findAll).toHaveBeenCalled();
      expect(data).toEqual(mockPatients);
      expect(response.status).toBe(200);
    });

    it('should return 500 if fetch fails', async () => {
      (PatientModel.findAll as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error', 'Failed to fetch patients');
    });
  });

  describe('POST', () => {
    it('should create a patient', async () => {
      const mockInput = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
      };
      const mockCreated = { id: '1', ...mockInput, dateOfBirth: new Date('1990-01-01') };

      (PatientModel.create as jest.Mock).mockResolvedValue(mockCreated);

      const request = new NextRequest('http://localhost/api/patients', {
        method: 'POST',
        body: JSON.stringify(mockInput),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(PatientModel.create).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'John',
        dateOfBirth: expect.any(Date),
      }));
      expect(data).toEqual(JSON.parse(JSON.stringify(mockCreated))); // Handle date serialization
      expect(response.status).toBe(201);
    });

    it('should return 500 if create fails', async () => {
      const mockInput = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
      };

      (PatientModel.create as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const request = new NextRequest('http://localhost/api/patients', {
        method: 'POST',
        body: JSON.stringify(mockInput),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error', 'Failed to create patient');
    });
  });
});
