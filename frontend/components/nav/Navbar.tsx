'use client';
import React from 'react';
import { ModeToggle } from '../ModeToggle';
import { useUser } from '@/hooks/useUser';
import UserButton from '../UserButton';
import MobileNav from './MobileNav';

const Navbar = () => {
  const { user } = useUser();
  return (
    <div className='w-full py-3 flex items-center justify-between px-6 border-b'>
      <ModeToggle />
      <div className='sm:flex hidden'>
        <UserButton user={user!} />
      </div>
      <div className='flex sm:hidden'>
        <MobileNav user={user!} />
      </div>
    </div>
  );
};

export default Navbar;
