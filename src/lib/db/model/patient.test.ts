/* eslint-disable @typescript-eslint/no-explicit-any */
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

describe('PatientModel', () => {
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
    };
    mockDb.collection.mockReturnValue(mockCollection);
  });

  describe('create', () => {
    it('should create a patient successfully', async () => {
      mockCollection.insertOne.mockResolvedValue({ insertedId: new ObjectId('507f1f77bcf86cd799439011') });

      const input = {
        firstName: 'Jane',
        lastName: 'Doe',
        title: 'Mrs',
        gender: 'Female' as const,
        dateOfBirth: new Date('1995-05-05'),
        phoneNumber: '1234567890',
        isNew: true,
      };

      const result = await PatientModel.create(input);

      expect(mockCollection.insertOne).toHaveBeenCalled();
      expect(result).toHaveProperty('_id', '507f1f77bcf86cd799439011');
      expect(result.hospitalId).toBeDefined();
      expect(result.firstName).toBe('Jane');
    });
  });

  describe('findById', () => {
    it('should return patient by id', async () => {
      const mockPatient = { 
        _id: new ObjectId('507f1f77bcf86cd799439011'), 
        firstName: 'Jane' 
      };

      mockCollection.findOne.mockResolvedValue(mockPatient);

      const result = await PatientModel.findById('507f1f77bcf86cd799439011');

      expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: new ObjectId('507f1f77bcf86cd799439011') });
      expect(result).toHaveProperty('_id', '507f1f77bcf86cd799439011');
    });

    it('should return null if patient not found', async () => {
      mockCollection.findOne.mockResolvedValue(null);

      const result = await PatientModel.findById('507f1f77bcf86cd799439011');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all patients', async () => {
      const mockPatients = [
        { _id: new ObjectId('507f1f77bcf86cd799439011'), firstName: 'Jane' },
        { _id: new ObjectId('507f1f77bcf86cd799439012'), firstName: 'John' },
      ];

      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mockPatients),
      };
      mockCollection.find.mockReturnValue(mockFind);

      const result = await PatientModel.findAll();

      expect(mockCollection.find).toHaveBeenCalled();
      expect(mockFind.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toHaveLength(2);
    });
  });

  describe('search', () => {
    it('should search patients by query', async () => {
      const mockPatients = [
        { _id: new ObjectId('507f1f77bcf86cd799439011'), firstName: 'Jane' },
      ];

      const mockFind = {
        toArray: jest.fn().mockResolvedValue(mockPatients),
      };
      mockCollection.find.mockReturnValue(mockFind);

      const result = await PatientModel.search('Jane');

      expect(mockCollection.find).toHaveBeenCalledWith({
        $or: [
          { firstName: { $regex: 'Jane', $options: 'i' } },
          { lastName: { $regex: 'Jane', $options: 'i' } },
          { hospitalId: { $regex: 'Jane', $options: 'i' } }
        ]
      });
      expect(result).toHaveLength(1);
    });
  });
});
