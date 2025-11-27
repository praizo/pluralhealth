import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '@/services/appointments';
import { Appointment } from '@/lib/types/appointment';

export function useAppointmentsTable(searchQuery: string = '') {
  const [selectedClinic, setSelectedClinic] = useState<string>('All clinics');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: appointments, isLoading, error } = useQuery<Appointment[]>({
    queryKey: ['appointments'],
    queryFn: appointmentService.getAll,
  });

  const clinics = useMemo(() => {
    return ['All clinics', ...Array.from(new Set((appointments || []).map(apt => apt.clinic)))];
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return (appointments || []).filter(apt => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const fullName = `${apt.patient?.firstName} ${apt.patient?.lastName}`.toLowerCase();
        const hospitalId = (apt.patient?.hospitalId || '').toLowerCase();
        if (!fullName.includes(query) && !hospitalId.includes(query)) return false;
      }

      // Clinic filter
      if (selectedClinic !== 'All clinics' && apt.clinic !== selectedClinic) return false;

      return true;
    });
  }, [appointments, searchQuery, selectedClinic]);

  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [filteredAppointments, sortOrder]);

  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedAppointments.slice(startIndex, endIndex);
  }, [sortedAppointments, currentPage]);

  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    appointments: paginatedAppointments,
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
    totalCount: filteredAppointments.length,
    startIndex,
    endIndex,
  };
}
