import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import { CreatePatientInput, Patient } from '@/lib/types/patient';

export class PatientModel {
  static async create(patientData: CreatePatientInput): Promise<Patient> {
    const client = await clientPromise;
    const db = client.db();
    
    const hospitalId = `HOSP${Date.now()}${Math.random().toString(12).substr(2, 5)}`.toUpperCase();
    
    const patient = {
      ...patientData,
      hospitalId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection('patients').insertOne(patient);
    return { ...patient, _id: result.insertedId.toString() } as Patient;
  }

  static async findById(id: string): Promise<Patient | null> {
    const client = await clientPromise;
    const db = client.db();
    
    const patient = await db.collection('patients').findOne({ _id: new ObjectId(id) });
    if (!patient) return null;
    return { ...patient, _id: patient._id.toString() } as unknown as Patient;
  }

  static async findAll(): Promise<Patient[]> {
    const client = await clientPromise;
    const db = client.db();
    
    const patients = await db.collection('patients').find().sort({ createdAt: -1 }).toArray();
    return patients.map(p => ({ ...p, _id: p._id.toString() })) as unknown as Patient[];
  }

  static async search(query: string): Promise<Patient[]> {
    const client = await clientPromise;
    const db = client.db();
    
    const patients = await db.collection('patients').find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { hospitalId: { $regex: query, $options: 'i' } }
      ]
    }).toArray();
    
    return patients.map(p => ({ ...p, _id: p._id.toString() })) as unknown as Patient[];
  }
}