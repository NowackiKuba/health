'use client';

import { getCurrentClinic } from '@/actions/clinic.actions';
import { useQuery } from '@tanstack/react-query';

const useClinic = () => {
  const { data: clinic, isLoading } = useQuery({
    queryKey: ['getCurrentClinic'],
    queryFn: async () => await getCurrentClinic(),
  });

  return { clinic, isLoading };
};

export default useClinic;
