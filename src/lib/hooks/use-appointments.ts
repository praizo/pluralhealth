import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { appointmentService } from '@/services/appointments';

export const useAppointments = () => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentService.getAll,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: appointmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};