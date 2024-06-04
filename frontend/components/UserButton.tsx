'use client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Edit, LogOut, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { handleLogOut } from '@/actions/auth.actions';
import { toast } from './ui/use-toast';
import { useTheme } from 'next-themes';
import { Switch } from './ui/switch';

const UserButton = ({ user }: { user: TEmployee }) => {
  const router = useRouter();

  const { theme, setTheme } = useTheme();
  const { mutate: logout } = useMutation({
    mutationKey: ['logout'],
    mutationFn: handleLogOut,
    onSuccess: () => {
      router.push('/login');
    },
    onError: () => {
      toast({
        title: 'Error logging out',
        duration: 1500,
      });
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className='h-14 w-14'>
          <AvatarImage src={user?.imgUrl || ''} />
          <AvatarFallback className='h-14 w-14'>
            <div className='h-14 w-14 rounded-full flex items-center justify-center bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 text-xl font-bold'>
              {user?.firstName[0]}
              {user?.lastName[0]}
            </div>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className='flex items-center gap-2 border-b py-2 px-2'>
          <Avatar className='h-10 w-10'>
            <AvatarImage src={user?.imgUrl || ''} />
            <AvatarFallback className='h-10 w-10'>
              <div className='h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 text-base font-bold'>
                {user?.firstName[0]}
                {user?.lastName[0]}
              </div>
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <p className='text-sm font-[500]'>
              {user?.firstName} {user?.lastName}
            </p>
            <p className='text-xs text-gray-400 dark:text-gray-600'>
              ID: {user?.id}
            </p>
          </div>
        </div>
        <DropdownMenuItem className='flex items-center justify-between cursor-pointer'>
          <div className='flex items-center gap-2'>
            <Moon className='h-4 w-4' />
            <p>Dark Mode</p>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={() => {
              if (theme === 'dark') {
                setTheme('light');
              } else {
                setTheme('dark');
              }
            }}
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='flex items-center gap-2 cursor-pointer text-red-500'
          onClick={() => logout()}
        >
          <LogOut className='h-4 w-4' />
          <p>Log Out</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
