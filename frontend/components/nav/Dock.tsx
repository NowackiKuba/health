'use client';
import { dockLinks } from '@/constants';
import { useUser } from '@/hooks/useUser';
import { Linden_Hill } from 'next/font/google';
import Link from 'next/link';
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';

const Dock = () => {
  const { user, isLoading, accountType } = useUser();
  const pathname = usePathname();
  const doctorToShow = [
    'Home',
    'Calendar',
    'Appointments',
    'Tasks',
    'Documents',
    'Settings',
  ];
  console.log(typeof accountType);
  return (
    <>
      {user?.hideDock ? (
        <div className='w-full h-20 group'>
          <div className='w-full px-44 pb-3 hidden group-hover:flex animate-in duration-100 ease-linear'>
            <div className='w-full bg-black/10 dark:bg-gray-200/10 rounded-full py-1 flex items-center justify-center gap-12'>
              {dockLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    href={link.path}
                    key={link.id}
                    className={`${
                      accountType?.toLowerCase() === 'doctor'
                        ? doctorToShow.includes(link.name)
                          ? 'flex'
                          : 'hidden'
                        : 'flex'
                    }`}
                  >
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                          <Icon
                            className={`${
                              pathname === link.path ? 'scale-[1.25]' : ''
                            }  h-14 w-14 hover:scale-[1.25] duration-100 ease-linear`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>{link.name}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Link>
                );
              })}
              <div className='h-12 w-[1px] dark:bg-gray-100 bg-gray-600'></div>
              <LogOut className='h-10 w-10' />
            </div>
          </div>
        </div>
      ) : (
        <div className='absolute z-10 sm:flex hidden w-full xl:px-16 lg:px-20 md:px-8 pb-3 sm:px-2'>
          <div className='w-full bg-black/10 dark:bg-gray-200/10 rounded-full py-1 flex items-center justify-center md:gap-5 lg:gap-8 xl:gap-12 gap-6'>
            {dockLinks.map((link) => {
              const Icon = link.icon;
              const newLink =
                accountType?.toLowerCase() === 'doctor'
                  ? `${link.path}?doctorId=${user?.id}`
                  : link.path;
              return (
                <Link
                  href={newLink}
                  key={link.id}
                  className={`${
                    accountType?.toLowerCase() === 'doctor'
                      ? doctorToShow.includes(link.name)
                        ? 'flex'
                        : 'hidden'
                      : 'flex'
                  }`}
                >
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger>
                        <Icon
                          className={`${
                            pathname === link.path ? 'scale-[1.25]' : ''
                          } h-10 w-10 md:h-10 lg:h-14 md:w-10 lg:w-14 hover:scale-[1.25] duration-100 ease-linear`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>{link.name}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Dock;
