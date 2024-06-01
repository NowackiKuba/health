import { useEmployee } from '@/hooks/useEmployee';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import {
  addDays,
  addMonths,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
  subDays,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  employeeId: string;
  selectedHour: string;
  setSelectedHour: Dispatch<SetStateAction<string>>;
  selectedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
}

const SelectAppointmentDateDialog = ({
  open,
  setOpen,
  employeeId,
  selectedHour,
  selectedDate,
  setSelectedDate,
  setSelectedHour,
}: Props) => {
  const [hourIndex, setHourIndex] = useState<number>(0);
  const [hourEndIndex, setHourEndIndex] = useState<number>(5);
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const startOfWeekDate = startOfWeek(currentDate);
  const endOfWeekDate = endOfWeek(currentDate);

  const handleNextWeek = () => {
    const newDate = addDays(currentDate, 7);
    setCurrentDate(newDate);
    if (!isSameMonth(newDate, currentMonth)) {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const handlePreviousWeek = () => {
    const newDate = subDays(currentDate, 7);
    setCurrentDate(newDate);
    if (!isSameMonth(newDate, currentMonth)) {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
  };

  const renderDaysOfWeek = () => {
    const days = [];
    let day = startOfWeekDate;
    for (let i = 0; i < 7; i++) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };
  const { employee } = useEmployee({ employeeId });
  if (selectedDate) {
    console.log(
      employee?.appointments?.find(
        (a) =>
          format(a.date, 'dd.MM.yyyyy') ===
            format(selectedDate, 'dd.MM.yyyyy') && a.hour === '12:00'
      )
    );
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='max-w-4xl flex flex-col gap-4 w-full'>
        <div className='px-8 w-full gap-2 py-3 flex flex-col items-center justify-center border-b'>
          <p className='text-xl font-semibold'>
            {format(currentMonth, 'LLLL yyyy')}
          </p>
          {/* <h2>{format(currentMonth, 'MMMM yyyy')}</h2> */}
          {/* <button onClick={handlePreviousWeek}>Previous Week</button> */}
          {/* <button onClick={handleNextWeek}>Next Week</button> */}
          {/* <div className='week'>{renderDaysOfWeek()}</div> */}
          <div className='flex items-center gap-3 w-full'>
            <ChevronLeft onClick={handlePreviousWeek} />
            <div className='flex items-center w-full gap-2'>
              {renderDaysOfWeek().map((d) => (
                <div
                  className={`${
                    format(d, 'dd.MM.yyyy') ==
                    format(selectedDate || new Date(), 'dd.MM.yyyy')
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary'
                      : ''
                  } flex flex-col items-center justify-center w-24 h-28  border rounded-md`}
                  onClick={() => {
                    setSelectedDate(d);
                  }}
                  key={d.toString()}
                >
                  <p
                    className={`${
                      format(d, 'dd.MM.yyyy') ==
                      format(new Date(), 'dd.MM.yyyy')
                        ? 'text-primary'
                        : ''
                    }`}
                  >
                    {format(d, 'EEE')}
                  </p>
                  <p>{format(d, 'dd.MM')}</p>
                </div>
              ))}
            </div>
            <ChevronRight onClick={handleNextWeek} />
          </div>
        </div>
        <div className='px-8 pb-4 border-b w-full flex flex-col items-start'>
          <div className='flex items-center gap-4 w-full'>
            <ChevronLeft
              className={`cursor-pointer ${
                hourIndex <= 0
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              onClick={() => {
                if (hourIndex > 0) {
                  setHourIndex(hourIndex - 1);
                  setHourEndIndex(hourEndIndex - 1);
                }
              }}
            />
            {hours.map((hour, index) => (
              <div
                key={hour}
                onClick={() => {
                  if (
                    employee?.appointments?.find(
                      (a) =>
                        format(a.date, 'dd.MM.yyyyy') ===
                          format(selectedDate || new Date(), 'dd.MM.yyyyy') &&
                        a.hour === hour
                    )
                  ) {
                    return;
                  } else {
                    setSelectedHour(hour);
                  }
                }}
                className={`cursor-pointer ${
                  selectedHour === hour
                    ? 'text-primary bg-primary/10 dark:text-green-200 dark:bg-green-500/20'
                    : ''
                } ${
                  index >= hourIndex && index <= hourEndIndex
                    ? 'flex'
                    : 'hidden'
                }  flex items-center justify-center py-2 rounded-md w-32  ${
                  employee?.appointments?.find(
                    (a) =>
                      format(a.date, 'dd.MM.yyyyy') ===
                        format(selectedDate || new Date(), 'dd.MM.yyyyy') &&
                      a.hour === hour
                  )
                    ? 'bg-red-200 dark:bg-red-500/20 cursor-not-allowed'
                    : 'bg-secondary '
                }`}
              >
                {hour}
              </div>
            ))}
            <ChevronRight
              className={`${
                hourIndex >= hours.length - 6
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              onClick={() => {
                if (hourIndex < hours.length - 6) {
                  setHourIndex(hourIndex + 1);
                  setHourEndIndex(hourEndIndex + 1);
                }
              }}
            />
          </div>
        </div>
        <Button className='w-full' onClick={() => setOpen(false)}>
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SelectAppointmentDateDialog;
