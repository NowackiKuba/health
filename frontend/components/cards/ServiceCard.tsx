import React from 'react';
import { MdMiscellaneousServices } from 'react-icons/md';

interface Props {
  service: TService;
}

const ServiceCard = ({ service }: Props) => {
  return (
    <div className='p-2 flex flex-col gap-2.5 xl:w-[334px] bg-secondary rounded-xl'>
      <div className='h-16 w-16 flex items-center justify-center bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 rounded-full'>
        <MdMiscellaneousServices className='h-8 w-8' />
      </div>
      <p className='text-xl font-[500]'>{service?.name}</p>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-2'>
          <p className='font-[500]'>Price:</p>
          <p>{service?.price} PLN</p>
        </div>
        <div className='flex items-center gap-2'>
          <p className='font-[500]'>Estimated Duration:</p>
          <p>{service?.duration} minutes</p>
        </div>

        <div className='flex items-center gap-2 w-full flex-wrap'>
          {service?.employees?.map((employee) => (
            <p
              key={employee.id}
              className='px-2 py-1 rounded-md text-sm bg-background'
            >
              {employee?.firstName} {employee?.lastName}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
