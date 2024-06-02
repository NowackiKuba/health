'use client';
import { format } from 'date-fns';
import React, { forwardRef } from 'react';
import Barcode from 'react-barcode';

interface Props {
  medicineArray: TMedicine[];
  prescriptionCode: number;
  doctor: TEmployee;
  patient: TPatient;
}

const Prescription = forwardRef(
  (
    { medicineArray, prescriptionCode, patient, doctor }: Props,
    ref: any
  ): any => {
    return (
      <div className='w-full px-72'>
        <div
          ref={ref}
          className='bg-white p-4 flex flex-col items-center justify-start text-black'
        >
          <div className='flex flex-col w-full'>
            <p className='text-xl font-semibold text-start w-full'>
              Healtea Prescription
            </p>
            <div className='w-full items-center flex-col flex'>
              <Barcode
                value='1032918391038131802938103289'
                width={3}
                height={50}
                fontSize={10}
              />
              <p className='text-end w-full text-sm'>
                Prefix: 2.102.53124.1234.642.3523.0D23
              </p>
            </div>
            <div className='flex items-center justify-between w-full border-b'>
              <p>
                Code:
                <span className='font-semibold text-lg'>
                  {' '}
                  {prescriptionCode}
                </span>
              </p>
              <p>
                <span className='font-semibold'>Issued: </span>
                {format(new Date(), 'dd.MM.yyyy')}
              </p>
            </div>
          </div>
          <div className='flex flex-col items-start justify-start w-full py-2 border-b'>
            <div className='flex items-center gap-2'>
              <p>
                Patient:{' '}
                <span className='uppercase'>
                  {patient?.firstName} {patient?.lastName}
                </span>
              </p>
            </div>
            <div className='flex items-start gap-2'>
              <p>Doctor: </p>
              <div className='flex flex-col'>
                <p>
                  {doctor?.firstName} {doctor?.lastName}
                </p>
                {/* // !Dodac do db kod doktora */}
                <p>4134242</p>
                <p>Tel: {doctor.phone}</p>
              </div>
            </div>
          </div>
          {medicineArray?.map((m, index) => (
            <div
              key={m.seed}
              className='flex flex-col gap-2 text-sm items-start justify-start w-full border-b py-2'
            >
              <div className='flex items-center justify-between w-full'>
                <p>
                  Prescription {index + 1} / {medicineArray.length}
                </p>
                <p>{m.seed}</p>
              </div>
              <div className='flex items-center justify-between w-full'>
                <div className='flex flex-col'>
                  <p>{m.name}</p>
                  <p>{m.quantity} pcs</p>
                </div>
                <div className='flex items-start gap-1'>
                  <div className='h-[24px] w-[1.5px] bg-black' />
                  <p>{m.discount}%</p>
                </div>
              </div>
              <p>
                {m.dose} {m.frequency} {m.duration}
              </p>
            </div>
          ))}
          <p className='w-full text-center text-xs text-gray-400'>
            Generated VIA healther
          </p>
        </div>
      </div>
    );
  }
);

Prescription.displayName = 'Prescription';
export default Prescription;
