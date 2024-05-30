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
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  console.log(user);
  return (
    <>
      {user?.hideDock ? (
        <div className='w-full h-20 group'>
          <div className='w-full px-44 pb-3 hidden group-hover:flex animate-in duration-100 ease-linear'>
            <div className='w-full bg-black/10 dark:bg-gray-200/10 rounded-full py-1 flex items-center justify-center gap-12'>
              {dockLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link href={link.path} key={link.id}>
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                          <Icon
                            className={`${
                              pathname === link.path ? 'scale-[1.25]' : ''
                            } h-14 w-14 hover:scale-[1.25] duration-100 ease-linear`}
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
        <div className='w-full px-44 pb-3'>
          <div className='w-full bg-black/10 dark:bg-gray-200/10 rounded-full py-1 flex items-center justify-center gap-12'>
            {dockLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link href={link.path} key={link.id}>
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger>
                        <Icon
                          className={`${
                            pathname === link.path ? 'scale-[1.25]' : ''
                          } h-14 w-14 hover:scale-[1.25] duration-100 ease-linear`}
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
      )}
    </>
  );
};

export default Dock;
