'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { ChevronDown, CirclePlus } from 'lucide-react';
import CreateServiceDialog from '../dialogs/CreateServiceDialog';
import { useServices } from '@/hooks/useServices';
import ServiceCard from '../cards/ServiceCard';

const ServicesPage = () => {
  const { services } = useServices();
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  return (
    <div className='flex flex-col w-full gap-4'>
      <div className='flex items-center justify-between w-full'>
        <p className='text-2xl font-semibold'>Services</p>
        <div className='flex items-center gap-2'>
          <Button
            className='flex items-center gap-2'
            onClick={() => setIsOpenCreate(true)}
          >
            <CirclePlus className='h-5 w-5' />
            <p>Add Service</p>
          </Button>
          <Button
            variant={'primary-outline'}
            className='flex items-center gap-2'
          >
            <p>Actions</p>
            <ChevronDown className='h-5 w-5' />
          </Button>
        </div>
      </div>
      <div className='flex items-center flex-wrap gap-4'>
        {services?.map((service) => (
          <ServiceCard service={service} key={service.id} />
        ))}
      </div>
      <CreateServiceDialog open={isOpenCreate} setOpen={setIsOpenCreate} />
    </div>
  );
};

export default ServicesPage;
