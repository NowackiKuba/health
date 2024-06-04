'use client';
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { dockLinks } from '@/constants';
import Link from 'next/link';

const MobileNav = ({ user }: { user: TEmployee }) => {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent>
        <div className='flex flex-row py-4 border-b items-center gap-2'>
          <Avatar className=' sm:h-20 h-16 w-16 sm:w-20'>
            <AvatarImage src={user?.imgUrl || ''} />
            <AvatarFallback className=' sm:h-20 h-16 w-16 sm:w-20'>
              <div className=' sm:h-20 h-16 w-16 sm:w-20 rounded-full flex items-center justify-center bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 text-xl sm:text-2xl font-bold'>
                {user?.firstName[0]}
                {user?.lastName[0]}
              </div>
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <p className='text-base sm:text-lg font-semibold'>
              {user?.firstName} {user?.lastName}
            </p>
            <p className='text-xs max-w-[130px] sm:max-w-full truncate sm:text-sm dark:text-gray-600 text-gray-400'>
              ID: {user?.id}
            </p>
          </div>
        </div>
        <div className='flex flex-col items-start sm:gap-2 w-full sm:pr-16'>
          {dockLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                href={link.path}
                key={link.id}
                className={`px-3 py-4 w-full ${
                  pathname === link.path
                    ? 'bg-primary/10 dark:bg-green-500/20 rounded-xl'
                    : ''
                } flex items-center gap-2`}
              >
                <Icon />
                <p>{link.name}</p>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
