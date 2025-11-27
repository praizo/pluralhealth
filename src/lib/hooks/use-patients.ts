import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { patientService } from '@/services/patients';

export const usePatients = () => {
  return useQuery({
    queryKey: ['patients'],
    queryFn: patientService.getAll,
  });
};

export const usePatient = (id: string) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getById(id),
    enabled: !!id,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: patientService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export const useSearchPatients = (query: string) => {
  return useQuery({
    queryKey: ['patients', 'search', query],
    queryFn: () => patientService.search(query),
    enabled: query.length > 2,
  });
};