'use client';
import useClinic from '@/hooks/useClinic';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ChevronDown, CirclePlus, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import AppointmentDetailsDialog from '../dialogs/AppointmentDetailsDialog';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { getCurrentUser } from '@/actions/user.actions';
import { formUrlQuery } from '@/utils';

const CalendarPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorId = searchParams.get('doctorId');
  const [accountType, setAccountType] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<TAppointment>();
  const [days, setDays] = useState<Date[]>();
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const hours = [
    '8:00',
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ];
  const { clinic, isLoading } = useClinic();
  useEffect(() => {
    if (view === 'daily') setDays([new Date()]);
    else if (view === 'weekly') {
      let weekDays: any[] = [];
      for (let i = 0; i < 7; i++) {
        weekDays.push(
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() + i
          )
        );
      }
      setDays(weekDays);
    } else if (view === 'monthly') {
      let monthDays = [];
      for (let i = 0; i < 30; i++) {
        monthDays.push(
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() + i
          )
        );
      }
      setDays(monthDays);
    }
  }, [view]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const res = await getCurrentUser();
      if (res.accountType.toString().toLowerCase() === 'doctor' && !doctorId) {
        const newUrl = formUrlQuery({
          key: 'doctorId',
          value: res.user.id,
          params: searchParams.toString(),
        });
        setAccountType(res.accountType.toString().toLowerCase());
        router.push(newUrl, { scroll: false });
      }
    };
    fetchCurrentUser();
  }, []);

  if (isLoading) {
    return (
      <div className='w-full mt-12 flex flex-col items-center justify-center'>
        <Loader2 className='text-primary h-40 w-40 animate-spin' />
        <p>Loading Calendar</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center justify-between w-full'>
        <p className='text-3xl font-semibold'>Calendar</p>
        {/* <div className='flex items-center justify-center gap-2'>
          <Button
            className='flex items-center gap-2'
            // onClick={() => setIsOpenCreate(true)}
          >
            <CirclePlus className='h-5 w-5' />
            <p>Create Employee Account</p>
          </Button>
          <Button
            variant={'primary-outline'}
            className='flex items-center gap-2'
          >
            <p>Actions</p>
            <ChevronDown className='h-5 w-5' />
          </Button>
        </div> */}
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button
            variant={view === 'daily' ? 'default' : 'primary-outline'}
            onClick={() => setView('daily')}
          >
            Daily
          </Button>
          <Button
            variant={view === 'weekly' ? 'default' : 'primary-outline'}
            onClick={() => setView('weekly')}
          >
            Weekly
          </Button>
          <Button
            variant={view === 'monthly' ? 'default' : 'primary-outline'}
            onClick={() => setView('monthly')}
          >
            Monthly
          </Button>
        </div>
      </div>
      {view === 'daily' ? (
        <div className='flex flex-col w-full'>
          {hours.map((hour, hourIndex) => (
            <div
              className='flex items-start w-full border-b h-[120px]'
              key={hourIndex}
            >
              <p>{hour}</p>
              {clinic?.appointments?.map((appointment) => {
                return (
                  <div
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setIsOpenDetails(true);
                    }}
                    key={appointment.id}
                    className={`${
                      doctorId
                        ? doctorId === appointment.employeeId
                          ? 'flex'
                          : 'hidden'
                        : 'flex'
                    } p-2 cursor-pointer h-[102px] ml-2 mt-2 flex flex-col rounded-lg bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 ${
                      appointment.hour === hour &&
                      format(appointment.date, 'dd.MM.yyyy') ===
                        format(new Date(), 'dd.MM.yyyy')
                        ? 'flex'
                        : 'hidden'
                    }`}
                  >
                    <p className='text-sm font-[500]'>
                      {appointment?.employeeId}{' '}
                      {appointment?.employee?.lastName}
                    </p>
                    <p className='text-xs'>
                      {format(appointment.date, 'dd.MM.yyyy')},{' '}
                      {appointment.hour}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : view === 'weekly' ? (
        <div className='flex items-center w-full'>
          {days?.map((day, index) => (
            <div
              key={index}
              className='flex xl:min-h-[540px] flex-col gap-1 w-full border px-2'
            >
              <div className='py-2 flex w-full flex-col items-center justify-center'>
                {format(day, 'dd.MM.yyyy')}
              </div>
              {clinic?.appointments?.map((appointment) => (
                <div
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setIsOpenDetails(true);
                  }}
                  key={appointment.id}
                  className={`p-2 cursor-pointer flex flex-col rounded-lg bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 ${
                    format(appointment.date, 'dd.MM.yyyy') ===
                    format(day, 'dd.MM.yyyy')
                      ? 'flex'
                      : 'hidden'
                  }`}
                >
                  <p className='text-sm font-[500]'>Appointment</p>
                  <p className='text-xs'>
                    {format(appointment.date, 'dd.MM.yyyy')}, {appointment.hour}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className='flex items-center flex-wrap  w-full'>
          {days?.map((day, index) => (
            <div
              key={index}
              className='xl:w-[153px] h-[134px] border flex flex-col py-2'
            >
              {format(day, 'dd.MM.yyyy')}
            </div>
          ))}
        </div>
      )}
      <AppointmentDetailsDialog
        appointment={selectedAppointment!}
        open={isOpenDetails}
        setOpen={setIsOpenDetails}
      />
    </div>
  );
};

export default CalendarPage;
