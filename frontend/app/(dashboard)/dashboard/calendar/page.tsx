import CalendarPage from '@/components/pages/CalendarPage';
import EmployeesPage from '@/components/pages/EmployeesPage';
import React from 'react';

const page = () => {
  return (
    <div className='w-full xl:px-16 lg:px-20 lg:mt-4 md:px-8 md:mt-2 xl:max-h-[calc(100vh-170px)] overflow-y-auto'>
      <CalendarPage />
    </div>
  );
};

export default page;
