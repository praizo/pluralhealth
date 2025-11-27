import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
 import { PatientModel } from './patient';
import { Appointment, CreateAppointmentInput } from '@/lib/types/appointment';

export class AppointmentModel {
  static async create(appointmentData: CreateAppointmentInput): Promise<Appointment> {
    const client = await clientPromise;
    const db = client.db();
    
    // Get patient details
    const patient = await PatientModel.findById(appointmentData.patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    // Calculate patient age for display
    const age = this.calculateAge(patient.dateOfBirth);
    
    const appointment = {
      ...appointmentData,
      patient: {
        firstName: patient.firstName,
        lastName: patient.lastName,
        hospitalId: patient.hospitalId,
        gender: patient.gender,
        age: age,
        isNew: patient.isNew
      },
      status: 'Processing' as const,
      amount: this.calculateAppointmentAmount(appointmentData.clinic, appointmentData.appointmentType),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection('appointments').insertOne(appointment);
    return { ...appointment, _id: result.insertedId.toString() } as Appointment;
  }

  static async findAll(): Promise<Appointment[]> {
    const client = await clientPromise;
    const db = client.db();
    
    const appointments = await db.collection('appointments')
      .find()
      .sort({ scheduledTime: 1 })
      .toArray();
    
    return appointments.map(apt => ({
      ...apt,
      _id: apt._id.toString()
    })) as unknown as Appointment[];
  }

  static async findById(id: string): Promise<Appointment | null> {
    const client = await clientPromise;
    const db = client.db();
    
    const appointment = await db.collection('appointments').findOne({ _id: new ObjectId(id) });
    if (!appointment) return null;
    
    return { ...appointment, _id: appointment._id.toString() } as unknown as Appointment;
  }

  static async findByPatientId(patientId: string): Promise<Appointment[]> {
    const client = await clientPromise;
    const db = client.db();
    
    const appointments = await db.collection('appointments')
      .find({ patientId })
      .sort({ scheduledTime: -1 })
      .toArray();
    
    return appointments.map(apt => ({
      ...apt,
      _id: apt._id.toString()
    })) as unknown as Appointment[];
  }

  static async updateStatus(id: string, status: Appointment['status']): Promise<Appointment | null> {
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('appointments').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    
    return result as Appointment | null;
  }

  private static calculateAge(dateOfBirth: Date | string): string {
    const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    const now = new Date();
    const diff = now.getTime() - dob.getTime();
    const ageDate = new Date(diff);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    const months = ageDate.getUTCMonth();
    const days = ageDate.getUTCDate() - 1;

    if (years > 0) {
      return `${years}yrs`;
    } else if (months > 0) {
      return `${months}mths`;
    } else {
      return `${days}days`;
    }
  }

  private static calculateAppointmentAmount(clinic: string, type: string): number {
    // Base prices for different clinics
    const basePrices: { [key: string]: number } = {
      'neurology': 90000,
      'cardiology': 150000,
      'gastroenterology': 120000,
      'renal': 110000,
      'accident and emergency': 100000,
      'general': 50000
    };

    const multipliers: { [key: string]: number } = {
      'New': 1.0,
      'Follow-up': 0.8,
      'Emergency': 1.5,
      'Walk-in': 1.0,
      'Referral': 1.0,
      'Consult': 1.2,
      'Medical Exam': 1.0
    };

    const normalizedClinic = clinic.toLowerCase();
    const basePrice = basePrices[normalizedClinic] || 100000;
    const multiplier = multipliers[type] || 1.0;
    
    return Math.round(basePrice * multiplier);
  }
}