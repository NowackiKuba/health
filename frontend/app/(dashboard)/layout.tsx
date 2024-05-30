import Dock from '@/components/nav/Dock';
import React, { ReactNode } from 'react';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='flex flex-col w-full h-screen'>
      <section className='w-full'>Mavbar</section>
      <section className='h-full w-full'>{children}</section>
      <section className='w-full'>
        <Dock />
      </section>
    </main>
  );
};

export default DashboardLayout;
