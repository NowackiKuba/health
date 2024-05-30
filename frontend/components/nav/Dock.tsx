'use client';
import { useUser } from '@/hooks/useUser';
import React from 'react';

const Dock = () => {
  const { user, isLoading } = useUser();
  console.log(user);
  return (
    <>
      {user?.hideDock ? null : (
        <div className='w-full px-44 pb-3'>
          <div className='w-full bg-black/10 rounded-full py-6'></div>
        </div>
      )}
    </>
  );
};

export default Dock;
