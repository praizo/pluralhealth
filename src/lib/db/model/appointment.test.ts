/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppointmentModel } from './appointment';
import { PatientModel } from './patient';
import clientPromise from '../mongodb';
import { ObjectId } from 'mongodb';

// Mock dependencies
jest.mock('../mongodb', () => {
  const mDb = {
    collection: jest.fn(),
  };
  const mClient = {
    db: jest.fn(() => mDb),
  };
  return Promise.resolve(mClient);
});

jest.mock('./patient');

describe('AppointmentModel', () => {
  let mockDb: any;
  let mockCollection: any;

  beforeAll(async () => {
    const client = await clientPromise;
    mockDb = client.db();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockCollection = {
      insertOne: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
    };
    mockDb.collection.mockReturnValue(mockCollection);
  });

  describe('create', () => {
    it('should create an appointment successfully', async () => {
      const mockPatient = {
        _id: 'patient-123',
        firstName: 'John',
        lastName: 'Doe',
        hospitalId: 'H123',
        gender: 'Male',
        dateOfBirth: new Date('1990-01-01'),
        isNew: false,
      };

      (PatientModel.findById as jest.Mock).mockResolvedValue(mockPatient);
      
      mockCollection.insertOne.mockResolvedValue({ insertedId: new ObjectId('507f1f77bcf86cd799439011') });

      const input = {
        patientId: 'patient-123',
        clinic: 'General',
        title: 'Checkup',
        appointmentType: 'Consult' as const,
        scheduledTime: new Date('2023-10-27T10:00:00Z'),
        doesNotRepeat: true,
      };

      const result = await AppointmentModel.create(input);

      expect(PatientModel.findById).toHaveBeenCalledWith('patient-123');
      expect(mockCollection.insertOne).toHaveBeenCalled();
      expect(result).toHaveProperty('_id', '507f1f77bcf86cd799439011');
      expect(result.patient?.firstName).toBe('John');
      expect(result.amount).toBeDefined();
    });

    it('should throw error if patient not found', async () => {
      (PatientModel.findById as jest.Mock).mockResolvedValue(null);

      const input = {
        patientId: 'non-existent',
        clinic: 'General',
        title: 'Checkup',
        appointmentType: 'Consult' as const,
        scheduledTime: new Date('2023-10-27T10:00:00Z'),
        doesNotRepeat: true,
      };

      await expect(AppointmentModel.create(input)).rejects.toThrow('Patient not found');
    });
  });

  describe('findAll', () => {
    it('should return all appointments', async () => {
      const mockAppointments = [
        { _id: new ObjectId('507f1f77bcf86cd799439011'), scheduledTime: '2023-10-27T10:00:00Z' },
        { _id: new ObjectId('507f1f77bcf86cd799439012'), scheduledTime: '2023-10-28T10:00:00Z' },
      ];

      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mockAppointments),
      };
      mockCollection.find.mockReturnValue(mockFind);

      const result = await AppointmentModel.findAll();

      expect(mockCollection.find).toHaveBeenCalled();
      expect(mockFind.sort).toHaveBeenCalledWith({ scheduledTime: 1 });
      expect(result).toHaveLength(2);
      expect(result[0]._id).toBe('507f1f77bcf86cd799439011');
    });
  });

  describe('findById', () => {
    it('should return appointment by id', async () => {
      const mockAppointment = { 
        _id: new ObjectId('507f1f77bcf86cd799439011'), 
        scheduledTime: '2023-10-27T10:00:00Z' 
      };

      mockCollection.findOne.mockResolvedValue(mockAppointment);

      const result = await AppointmentModel.findById('507f1f77bcf86cd799439011');

      expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: new ObjectId('507f1f77bcf86cd799439011') });
      expect(result).toHaveProperty('_id', '507f1f77bcf86cd799439011');
    });

    it('should return null if appointment not found', async () => {
      mockCollection.findOne.mockResolvedValue(null);

      const result = await AppointmentModel.findById('507f1f77bcf86cd799439011');

      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update appointment status', async () => {
      const mockAppointment = { 
        _id: new ObjectId('507f1f77bcf86cd799439011'), 
        status: 'Seen doctor' 
      };

      mockCollection.findOneAndUpdate.mockResolvedValue(mockAppointment);

      const result = await AppointmentModel.updateStatus('507f1f77bcf86cd799439011', 'Seen doctor');

      expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: new ObjectId('507f1f77bcf86cd799439011') },
        { $set: { status: 'Seen doctor', updatedAt: expect.any(Date) } },
        { returnDocument: 'after' }
      );
      expect(result).toHaveProperty('status', 'Seen doctor');
    });
  });
});
