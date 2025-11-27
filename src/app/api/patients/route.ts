 import { NextRequest, NextResponse } from 'next/server';
import { PatientModel } from '@/lib/db/model/patient';
import { CreatePatientInput } from '@/lib/types/patient';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const patients = await PatientModel.findAll();
        return NextResponse.json(patients);
    } catch (error) {
        console.error('Failed to fetch patients:', error);
        return NextResponse.json(
            { error: 'Failed to fetch patients', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: CreatePatientInput = await request.json();

        if (typeof body.dateOfBirth === 'string') {
            body.dateOfBirth = new Date(body.dateOfBirth);
        }

        const patient = await PatientModel.create(body);
        return NextResponse.json(patient, { status: 201 });
    } catch (error) {
        console.error('Failed to create patient:', error);
        return NextResponse.json(
            { error: 'Failed to create patient', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}