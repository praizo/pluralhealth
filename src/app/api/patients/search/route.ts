/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { PatientModel } from '@/lib/db/model/patient';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';

        const patients = await PatientModel.search(query);
        return NextResponse.json(patients);
    } catch (error) {
        console.error('Failed to search patients:', error);
        return NextResponse.json(
            { error: 'Failed to search patients', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}