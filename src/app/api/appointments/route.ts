import { AppointmentModel } from '@/lib/db/model/appointment';
import { CreateAppointmentInput } from '@/lib/types/appointment';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const appointments = await AppointmentModel.findAll();
        return NextResponse.json(appointments);
    } catch (error) {
        console.error('Failed to fetch appointments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch appointments', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: CreateAppointmentInput = await request.json();

        // Validate required fields
        if (!body.patientId || !body.clinic || !body.scheduledTime) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const appointment = await AppointmentModel.create(body);
        return NextResponse.json(appointment, { status: 201 });
    } catch (error) {
        console.error('Failed to create appointment:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create appointment' },
            { status: 500 }
        );
    }
}