import AppointmentsPage from '@/components/pages/AppointmentsPage';
import React from 'react';

const page = () => {
  return (
    <div className='w-full xl:px-16 xl:max-h-[700px] lg:max-h-[600px] md:max-h-[650px] sm:max-h-[570px] max-h-[100vh] overflow-y-auto h-full lg:px-20 lg:mt-4 md:px-8 md:mt-2 px-2 mt-4'>
      <AppointmentsPage />
    </div>
  );
};

export default page;
