'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { AppointmentStatus, AppointmentRow } from '@/lib/types/appointment';
import { StatusBadge } from '@/components/ui/status-badge';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { useAppointmentsTable } from '@/lib/hooks/use-appointments-table';
import { AppointmentControls } from './appointment-controls';

const statusTextColors: Record<AppointmentStatus, string> = {
  'Processing': 'text-[#D6AB00]',
  'Not arrived': 'text-[#FF2C2C]',
  'Awaiting vitals': 'text-[#A22CFF]',
  'Awaiting doctor': 'text-[#0B0C7D]',
  'Admitted to ward': 'text-[#FF8B00]',
  'Transferred to A&E': 'text-[#A22CFF]',
  'Seen doctor': 'text-[#27AE60]',
};

interface AppointmentListProps {
  searchQuery?: string;
}

export function AppointmentList({ searchQuery = '' }: AppointmentListProps) {
  const {
    appointments,
    isLoading,
    error,
    clinics,
    selectedClinic,
    setSelectedClinic,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    endIndex,
    totalCount,
  } = useAppointmentsTable(searchQuery);

  if (isLoading) {
    return <TableSkeleton />;
  }
  if (error) return <div className="p-8 text-center text-red-500">Error loading appointments</div>;

  const appointmentRows: AppointmentRow[] = appointments.map((apt) => ({
    id: apt._id,
    patient: {
      name: `${apt.patient?.firstName} ${apt.patient?.lastName}`,
      hospitalId: apt.patient?.hospitalId || '',
      gender: apt.patient?.gender || '',
      age: apt.patient?.age || '',
      avatarColor: 'bg-blue-100',
    },
    isNew: apt.patient?.isNew,
    hasRecord: true,
    clinic: {
      name: apt.clinic,
    },
    walletBalance: apt.amount,
    scheduledTime: format(new Date(apt.scheduledTime), 'hh:mm a'),
    scheduledDate: format(new Date(apt.scheduledTime), 'd MMM yyyy'),
    status: apt.status,
  }));

  return (
    <div>
      <AppointmentControls
        clinics={clinics}
        selectedClinic={selectedClinic}
        onClinicChange={setSelectedClinic}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        startIndex={startIndex}
        endIndex={endIndex}
        totalCount={totalCount}
      />

      {/* Table */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[1200px]">
          {/* Header */}
          <div className="grid grid-cols-[40px_4.2fr_1.5fr_2fr_2fr_1.5fr_3fr_20px] gap-4 px-6 py-3 text-[#A6AFC2] leading-[100%] font-bold text-base mb-2">
            <div>#</div>
            <div>Patient information</div>
            <div></div>
            <div>Clinic</div>
            <div>Wallet bal. (₦)</div>
            <div className='flex gap-2'>Time/Date <Image src="/images/appointments.svg" alt="calender icon" width={16} height={16} /></div>
            <div>Status</div>
            <div></div>
          </div>

          {/* Rows */}
          <div className="space-y-3">
            {appointmentRows.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No appointments found</div>
            ) : (
              appointmentRows.map((apt, index) => (
                <div
                  key={apt.id}
                  className="grid grid-cols-[40px_4.2fr_1.5fr_2fr_2fr_1.5fr_3fr_20px] gap-4 items-center bg-white hover:bg-[#DFE2E9] rounded-2xl transition-all duration-200 py-4 border-l-6 border-[#FF9D33] px-6 cursor-pointer"
                >
                  <div className="text-gray-500 flex items-center gap-2">
                    <Image src="/images/right-small.svg" alt="Right small icon" width={16} height={16} />
                    {startIndex + index + 1}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-gray-600 ${apt.patient.avatarColor}`}>
                      <Image src="/images/user.svg" alt="User" width={20} height={20} />
                    </div>
                    <div className='space-y-1.5'>
                      <div className="font-semibold text-[#051438] text-base leading-4 tracking-0">{apt.patient.name}</div>
                      <div className="text-xs leading-3 tracking-[4%] text-[#677597] flex items-center gap-1">
                        <span>{apt.patient.hospitalId}</span>
                        <span>•</span>
                        <span>{apt.patient.gender}</span>
                        <span>•</span>
                        <span>{apt.patient.age}</span>
                      </div>
                    </div>

                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <div >
                      {apt.isNew && (
                        <span className="px-2 py-1.5 bg-[#D0D1FB] text-[#0B0C7D] text-xs font-semibold  rounded">New</span>
                      )}
                    </div>
                   <div>
                      {apt.hasRecord && (
                        <Image 
                          src={['/images/scan-green.svg', '/images/scan-red.svg', '/images/scan-yello.svg'][index % 3]} 
                          alt="Scan record" 
                          width={32} 
                          height={32} 
                          className="w-8 h-8"
                        />
                      )}
                   </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#051438] text-base leading-[100%] tracking-0">{apt.clinic.name}</span>
                    {apt.clinic.extra && (
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">+{apt.clinic.extra}</span>
                    )}
                  </div>

                  <div className="font-semibold text-[#051438] text-base leading-[100%] tracking-0">
                    {apt.walletBalance.toLocaleString()}
                  </div>

                  <div className="font-semibold  text-base leading-[100%] space-y-1.5 tracking-0 text-center">
                    <p className={` ${statusTextColors[apt.status]}`}>{apt.scheduledTime}</p>
                    <p className={` ${statusTextColors[apt.status]}`}>{apt.scheduledDate}</p>
                  </div>

                  <div>
                    <StatusBadge status={apt.status} />
                  </div>

                  <div className="pr-6 flex justify-end">
                    <button className="text-gray-400 hover:text-gray-600" aria-label="More options">
                      <Image src="/images/more-vertical.svg" alt="More" width={16} height={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
