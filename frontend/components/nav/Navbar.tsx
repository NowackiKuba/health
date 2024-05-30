import React from 'react';
import { ModeToggle } from '../ModeToggle';

const Navbar = () => {
  return (
    <div className='w-full py-3 flex items-center justify-between px-6 border-b'>
      <ModeToggle />
    </div>
  );
};

export default Navbar;
