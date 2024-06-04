'use client';
import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { logInUser } from '@/actions/auth.actions';
import { useRouter } from 'next/navigation';
import { toast } from '../ui/use-toast';
import ButtonLoading from '../ButtonLoading';

const LoginForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const router = useRouter();
  const { mutate: handleLogIn, isPending: isLoggingIn } = useMutation({
    mutationKey: ['logInUser'],
    mutationFn: logInUser,
    onSuccess: () => {
      router.push('/dashboard');
      toast({
        title: 'Logged in successfully',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Something went wrong while logging in',
        description: 'Please try again',
        duration: 1500,
        variant: 'destructive',
      });
    },
  });
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex flex-col gap-0.5 w-full'>
        <Label>Email</Label>
        <Input onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className='flex items-center gap-2'>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Password</Label>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            type={isPasswordVisible ? 'text' : 'password'}
            onKeyDown={(e) => {
              if (password.length > 3 && e.key === 'Enter') {
                handleLogIn({ email, password });
              }
            }}
          />
        </div>
        <Button
          size={'icon'}
          variant={'ghost'}
          onClick={() => setIsPasswordVisible((prev) => !prev)}
        >
          {isPasswordVisible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
      <Button
        onClick={() => handleLogIn({ email, password })}
        disabled={isLoggingIn}
      >
        <ButtonLoading buttonText='Log In' isLoading={isLoggingIn} />
      </Button>
    </div>
  );
};

export default LoginForm;
