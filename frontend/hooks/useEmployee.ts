'use client';

import { getEmployeeById } from '@/actions/employee.actions';
import { useQuery } from '@tanstack/react-query';

export const useEmployee = ({ employeeId }: { employeeId: string }) => {
  const { data: employee, isLoading } = useQuery({
    queryKey: ['getEmployeeById', { employeeId }],
    queryFn: async () => getEmployeeById({ employeeId }),
  });

  return { employee, isLoading };
};
