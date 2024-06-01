'use client';

import { getCurrentUser } from '@/actions/user.actions';
import { useQuery } from '@tanstack/react-query';

export const useUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['getCurrentUser'],
    queryFn: async () => getCurrentUser(),
  });
  const user = data?.user;
  const accountType = data?.accountType;
  return { user, isLoading, accountType };
};
