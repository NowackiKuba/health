import PatientsPage from '@/components/pages/PatientsPage';
import React from 'react';

const page = () => {
  return (
    <div className='w-full xl:px-16  overflow-y-auto lg:px-20 lg:mt-4 md:px-8 px-2 md:mt-2 mt-4'>
      <PatientsPage />
    </div>
  );
};

export default page;
