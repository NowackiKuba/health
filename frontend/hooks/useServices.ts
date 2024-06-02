'use client';

import { getClinicServices } from '@/actions/service.actions';
import { useQuery } from '@tanstack/react-query';

export const useServices = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ['getClinicServices'],
    queryFn: async () => getClinicServices(),
  });

  return { services, isLoading };
};
