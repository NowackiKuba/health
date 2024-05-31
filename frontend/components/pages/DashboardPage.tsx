'use client';
import { useUser } from '@/hooks/useUser';
import { format } from 'date-fns';
import React from 'react';

const DashboardPage = () => {
  const { user, isLoading } = useUser();
  return (
    <div className='w-full flex flex-col gap-2'>
      <p className='text-2xl font-semibold'>
        {format(new Date(), 'dd.MM.yyyy')}, {user?.firstName} {user?.lastName}
      </p>
      <div className='flex flex-row items-center gap-4 w-full'>
        <div className='xl:min-h-80 bg-secondary w-2/5'></div>
      </div>
    </div>
  );
};

export default DashboardPage;