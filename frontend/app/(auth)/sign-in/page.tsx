import LoginForm from '@/components/forms/LoginForm';
import { Lock } from 'lucide-react';
import React from 'react';

const page = () => {
  return (
    <div className='flex items-center justify-center h-screen w-full'>
      <div className='py-2 w-full max-w-xl px-14 rounded-xl bg-secondary flex flex-col items-center justify-center gap-3'>
        <div className='h-20 w-20 rounded-full bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 flex items-center justify-center'>
          <Lock className='h-10 w-10' />
        </div>
        <p className='text-2xl font-semibold'>Log In To Your Account</p>
        <LoginForm />
      </div>
    </div>
  );
};

export default page;
