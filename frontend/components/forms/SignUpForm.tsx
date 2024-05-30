'use client';
import userValidation from '@/lib/validations/userValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createClinicAccount } from '@/actions/auth.actions';
import { useToast } from '../ui/use-toast';
import ButtonLoading from '../ButtonLoading';
import { Label } from '../ui/label';

interface ClinicData {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  userEmail: string;
  password: string;
  phoneNum: string;
}

const SignUpForm = () => {
  const [step, setStep] = useState<number>(1);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [clinicData, setClinicData] = useState<ClinicData | undefined>();
  const [userData, setUserData] = useState<UserData | undefined>();
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: handleSignUp, isPending: isCreating } = useMutation({
    mutationKey: ['handleSignUp'],
    mutationFn: createClinicAccount,
    onSuccess: () => {
      router.push('/login');
      toast({
        title: 'Successfully created clinic account',
        description: 'You can now login to your account',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Something went wrong',
        description:
          'We could not create clinic account. Please try again later',
        duration: 2000,
        variant: 'destructive',
      });
    },
  });
  return (
    <>
      {step === 1 ? (
        <div className='flex flex-col gap-4 w-full'>
          <div className='flex flex-col gap-0.5 w-full'>
            <Label>Clinic Name</Label>
            <Input
              defaultValue={clinicData?.name}
              className='w-full'
              onChange={(e) => {
                if (!clinicData) {
                  setClinicData({
                    name: e.target.value,
                    email: '',
                    address: '',
                    city: '',
                    state: '',
                    zip: '',
                    phone: '',
                  });
                } else {
                  setClinicData({ ...clinicData, name: e.target.value });
                }
              }}
            />
          </div>
          <div className='flex flex-col gap-0.5 w-full'>
            <Label>Email Address</Label>
            <Input
              defaultValue={clinicData?.email}
              className='w-full'
              onChange={(e) => {
                if (!clinicData) {
                  setClinicData({
                    name: '',
                    email: e.target.value,
                    address: '',
                    city: '',
                    state: '',
                    zip: '',
                    phone: '',
                  });
                } else {
                  setClinicData({ ...clinicData, email: e.target.value });
                }
              }}
            />
          </div>
          <div className='flex flex-col gap-0.5 w-full'>
            <Label>Phone Number</Label>
            <Input
              defaultValue={clinicData?.phone}
              className='w-full'
              onChange={(e) => {
                if (!clinicData) {
                  setClinicData({
                    name: '',
                    email: '',
                    address: '',
                    city: '',
                    state: '',
                    zip: '',
                    phone: e.target.value,
                  });
                } else {
                  setClinicData({ ...clinicData, phone: e.target.value });
                }
              }}
            />
          </div>
          <div className='flex items-center gap-2 w-full'>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>Address</Label>
              <Input
                defaultValue={clinicData?.address}
                className='w-full'
                onChange={(e) => {
                  if (!clinicData) {
                    setClinicData({
                      name: '',
                      email: '',
                      address: e.target.value,
                      city: '',
                      state: '',
                      zip: '',
                      phone: '',
                    });
                  } else {
                    setClinicData({ ...clinicData, address: e.target.value });
                  }
                }}
              />
            </div>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>City</Label>
              <Input
                defaultValue={clinicData?.city}
                className='w-full'
                onChange={(e) => {
                  if (!clinicData) {
                    setClinicData({
                      name: '',
                      email: '',
                      address: '',
                      city: e.target.value,
                      state: '',
                      zip: '',
                      phone: '',
                    });
                  } else {
                    setClinicData({ ...clinicData, city: e.target.value });
                  }
                }}
              />
            </div>
          </div>
          <div className='flex items-center gap-2 w-full'>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>State</Label>
              <Input
                defaultValue={clinicData?.state}
                className='w-full'
                onChange={(e) => {
                  if (!clinicData) {
                    setClinicData({
                      name: '',
                      email: '',
                      address: '',
                      city: '',
                      state: e.target.value,
                      zip: '',
                      phone: '',
                    });
                  } else {
                    setClinicData({ ...clinicData, state: e.target.value });
                  }
                }}
              />
            </div>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>Zip</Label>
              <Input
                defaultValue={clinicData?.zip}
                className='w-full'
                onChange={(e) => {
                  if (!clinicData) {
                    setClinicData({
                      name: '',
                      email: '',
                      address: '',
                      city: '',
                      state: '',
                      zip: e.target.value,
                      phone: '',
                    });
                  } else {
                    setClinicData({ ...clinicData, zip: e.target.value });
                  }
                }}
              />
            </div>
          </div>
          <div className='flex items-center gap-2 w-full'>
            <Button
              onClick={() => setStep(2)}
              className='flex items-center gap-2 w-full'
            >
              <p>Continue</p>
              <ArrowRight />
            </Button>
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-8 w-full'>
          <div className='flex items-center gap-2 w-full'>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>First Name</Label>
              <Input
                defaultValue={userData?.firstName}
                className='w-full'
                onChange={(e) => {
                  if (!userData) {
                    setUserData({
                      firstName: e.target.value,
                      lastName: '',
                      userEmail: '',
                      password: '',
                      phoneNum: '',
                    });
                  } else {
                    setUserData({ ...userData, firstName: e.target.value });
                  }
                }}
              />
            </div>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>Last Name</Label>
              <Input
                defaultValue={userData?.lastName}
                className='w-full'
                onChange={(e) => {
                  if (!userData) {
                    setUserData({
                      firstName: '',
                      lastName: e.target.value,
                      userEmail: '',
                      password: '',
                      phoneNum: '',
                    });
                  } else {
                    setUserData({ ...userData, lastName: e.target.value });
                  }
                }}
              />
            </div>
          </div>
          <div className='flex flex-col gap-0.5 w-full'>
            <Label>Email</Label>
            <Input
              defaultValue={userData?.userEmail}
              className='w-full'
              onChange={(e) => {
                if (!userData) {
                  setUserData({
                    firstName: '',
                    lastName: '',
                    userEmail: e.target.value,
                    password: '',
                    phoneNum: '',
                  });
                } else {
                  setUserData({ ...userData, userEmail: e.target.value });
                }
              }}
            />
          </div>
          <div className='flex flex-col gap-0.5 w-full'>
            <Label>Phone Number</Label>
            <Input
              defaultValue={userData?.phoneNum}
              className='w-full'
              onChange={(e) => {
                if (!userData) {
                  setUserData({
                    firstName: '',
                    lastName: '',
                    userEmail: '',
                    password: '',
                    phoneNum: e.target.value,
                  });
                } else {
                  setUserData({ ...userData, phoneNum: e.target.value });
                }
              }}
            />
          </div>
          <div className='flex items-center gap-2 w-full'>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>Hasło</Label>
              <Input
                defaultValue={userData?.password}
                type={isPasswordVisible ? 'text' : 'password'}
                className='w-full'
                onChange={(e) => {
                  if (!userData) {
                    setUserData({
                      firstName: '',
                      lastName: '',
                      userEmail: '',
                      password: e.target.value,
                      phoneNum: '',
                    });
                  } else {
                    setUserData({ ...userData, password: e.target.value });
                  }
                }}
              />
            </div>
            <Button
              variant={'ghost'}
              size={'icon'}
              onClick={() => setIsPasswordVisible((prev) => !prev)}
            >
              {isPasswordVisible ? <EyeOff /> : <Eye />}
            </Button>
          </div>

          <div className='flex items-center gap-2 w-full'>
            <Button
              onClick={() => {
                if (!clinicData || !userData) return;
                handleSignUp({
                  address: clinicData?.address,
                  city: clinicData?.city,
                  email: clinicData?.email,
                  name: clinicData?.name,
                  password: userData?.password,
                  phone: clinicData?.phone,
                  state: clinicData?.state,
                  zip: clinicData?.zip,
                  userEmail: userData?.userEmail,
                  userFirstName: userData?.firstName,
                  userLastName: userData?.lastName,
                  userPhone: userData?.phoneNum,
                });
              }}
              className='flex items-center gap-2 w-full'
            >
              <ButtonLoading
                isLoading={isCreating}
                buttonText='Create Account'
              />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUpForm;
