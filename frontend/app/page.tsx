'use server';
import { isAuth } from '@/actions/auth.actions';
import { getCurrentUser } from '@/actions/user.actions';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { isAuthed, isLoading } = await isAuth();
  const token = cookies().get('token');
  const user = await getCurrentUser();
  const res = await axios(
    `http://localhost:8080/api/clinic/get-employees/${user?.user?.clinicId}`,
    {
      method: 'GET',
      headers: {
        Authorization: token!.value,
      },
    }
  );

  console.log('nigga', res.data);
  if (isLoading) {
    <div className='flex flex-col items-center justify-center gap-2 w-full h-screen'>
      <Loader2 className='h-44 w-44 animate-spin' />
    </div>;
  }

  // if (!isAuthed) {
  //   redirect('/login');
  // } else {
  //   redirect('/dashboard');
  // }
}
