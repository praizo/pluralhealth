import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local or .env
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      content.split('\n').forEach(line => {
        const firstEquals = line.indexOf('=');
        if (firstEquals !== -1) {
          const key = line.substring(0, firstEquals).trim();
          const value = line.substring(firstEquals + 1).trim();
          if (key && value && !process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    }
  }
}

loadEnv();

// Client connection handled by src/lib/db/mongodb.ts

function calculateAge(dateOfBirth: Date): string {
  const now = new Date();
  const diff = now.getTime() - dateOfBirth.getTime();
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

// Generate hospital ID in format: HOSP + 8 digits
function generateHospitalId(): string {
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000); // 8 random digits
    return `HOSP${randomDigits}`;
  }

function calculateAppointmentAmount(clinic: string, type: string): number {
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

async function seed() {
  try {
    // Dynamic import to ensure env vars are loaded first
    const { default: clientPromise } = await import('../src/lib/db/mongodb');
    const client = await clientPromise;

    console.log('Connected to MongoDB');
    const db = client.db();

    // Clear existing data
    await db.collection('patients').deleteMany({});
    await db.collection('appointments').deleteMany({});
    console.log('Cleared existing data');

    const patients = [];
    const appointments = [];

    // Generate 20 patients
    for (let i = 0; i < 5; i++) {
      const sex = faker.person.sexType();
      const firstName = faker.person.firstName(sex);
      const lastName = faker.person.lastName();
      const gender = sex === 'female' ? 'Female' : 'Male';
      const hospitalId = generateHospitalId();
      
      const patient = {
        firstName,
        lastName,
        middleName: faker.person.middleName(),
        title: sex === 'female' ? 'Mrs' : 'Mr',
        dateOfBirth: faker.date.birthdate({ min: 0, max: 80, mode: 'age' }),
        gender: gender as 'Male' | 'Female' | 'Other',
        phoneNumber: faker.phone.number(),
        isNew: faker.datatype.boolean(),
        picture: faker.image.avatar(),
        hospitalId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.collection('patients').insertOne(patient);
      const patientWithId = { ...patient, _id: result.insertedId };
      patients.push(patientWithId);

      // Generate 1-3 appointments for each patient
      const numAppointments = faker.number.int({ min: 1, max: 3 });
      for (let j = 0; j < numAppointments; j++) {
        const clinic = faker.helpers.arrayElement(['Neurology', 'Cardiology', 'Gastroenterology', 'Renal', 'Accident and Emergency']);
        const appointmentType = faker.helpers.arrayElement(['New', 'Follow-up', 'Emergency', 'Walk-in', 'Referral', 'Consult', 'Medical Exam']);
        // Ensure appointment is in the future (within next 30 days)
        const scheduledTime = faker.date.soon({ days: 30 });
        const status = faker.helpers.arrayElement(['Processing', 'Not arrived', 'Awaiting vitals', 'Awaiting doctor', 'Admitted to ward', 'Transferred to A&E', 'Seen doctor']);
        const appointment = {
          patientId: patientWithId._id.toString(),
          clinic,
          title: faker.lorem.words(3),
          scheduledTime,
          appointmentType,
          doesNotRepeat: faker.datatype.boolean(),
          patient: {
            firstName: patient.firstName,
            lastName: patient.lastName,
            hospitalId: patient.hospitalId,
            gender: patient.gender,
            age: calculateAge(patient.dateOfBirth),
            isNew: patient.isNew
          },
          status,
          amount: calculateAppointmentAmount(clinic, appointmentType),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.collection('appointments').insertOne(appointment);
        appointments.push(appointment);
      }
    }

    console.log(`Seeded ${patients.length} patients and ${appointments.length} appointments`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
