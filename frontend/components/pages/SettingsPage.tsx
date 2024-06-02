'use client';
import { useUser } from '@/hooks/useUser';
import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import { editClinic } from '@/actions/clinic.actions';
import { toast } from '../ui/use-toast';
import ButtonLoading from '../ButtonLoading';

const SettingsPage = () => {
  const { user, accountType } = useUser();
  const [clinicName, setClinicName] = useState<string>('');
  const [clinicAddress, setClinicAddress] = useState<string>('');
  const [clinicPhone, setClinicPhone] = useState<string>('');
  const [clinicEmail, setClinicEmail] = useState<string>('');
  const [clinicZip, setClinicZip] = useState<string>('');
  const [clinicWebsiteUrl, setClinicWebsiteUrl] = useState<string>('');
  const [clinicCity, setClinicCity] = useState<string>('');
  const [clinicState, setClinicState] = useState<string>('');

  useEffect(() => {
    if (!user) return;
    setClinicName(user.clinic?.name || '');
    setClinicAddress(user.clinic?.address || '');
    setClinicPhone(user.clinic?.phone || '');
    setClinicEmail(user.clinic?.email || '');
    setClinicZip(user.clinic?.zip || '');
    setClinicCity(user.clinic?.city || '');
    setClinicState(user.clinic?.state || '');
    setClinicWebsiteUrl(user.clinic?.website || '');
  }, [user]);

  const { mutate: handleUpdateClinic, isPending: isUpdating } = useMutation({
    mutationKey: ['updateClinic'],
    mutationFn: editClinic,
    onSuccess: () => {
      toast({
        title: 'Successfully updated clinic',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Failed to update clinic',
        duration: 1500,
        description: 'Please try again later',
        variant: 'destructive',
      });
    },
  });
  return (
    <div className='flex flex-col gap-4 w-full'>
      <p className='text-4xl font-semibold'>Settings</p>
      {accountType?.toString().toLowerCase() === 'admin' && (
        <div className='xl:max-w-[640px] bg-secondary rounded-xl p-3 flex flex-col gap-6 w-full'>
          <p className='text-xl font-semibold'>Clinic</p>
          <div className='flex flex-col items-start justify-start w-full gap-2'>
            <div className='flex items-center gap-2 w-full'>
              <p className='w-[130px] text-lg font-[500]'>Name: </p>
              <Input
                defaultValue={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
              />
            </div>
            <div className='flex items-center gap-2 w-full'>
              <p className='w-[130px] text-lg font-[500]'>Email: </p>
              <Input
                defaultValue={clinicEmail}
                onChange={(e) => setClinicEmail(e.target.value)}
              />
            </div>
            <div className='flex items-center gap-2 w-full'>
              <p className='w-[130px] text-lg font-[500]'>Phone: </p>
              <Input
                defaultValue={clinicPhone}
                onChange={(e) => setClinicPhone(e.target.value)}
              />
            </div>
            <div className='flex items-center gap-2 w-full'>
              <p className='w-[130px] text-lg font-[500]'>Address: </p>
              <Input
                defaultValue={clinicAddress}
                onChange={(e) => setClinicAddress(e.target.value)}
              />
            </div>
            <div className='flex items-center gap-2 w-full'>
              <p className='w-[130px] text-lg font-[500]'>City: </p>
              <Input
                defaultValue={clinicCity}
                onChange={(e) => setClinicCity(e.target.value)}
              />
            </div>
            <div className='flex items-center gap-2 w-full'>
              <p className='w-[130px] text-lg font-[500]'>State: </p>
              <Input
                defaultValue={clinicState}
                onChange={(e) => setClinicState(e.target.value)}
              />
            </div>
            <div className='flex items-center gap-2 w-full'>
              <p className='w-[130px] text-lg font-[500]'>Zip: </p>
              <Input
                defaultValue={clinicZip}
                onChange={(e) => setClinicZip(e.target.value)}
              />
            </div>
            <div className='flex items-center gap-2 w-full'>
              <p className='w-[130px] text-lg font-[500]'>Website</p>
              <Input
                defaultValue={clinicWebsiteUrl}
                onChange={(e) => setClinicWebsiteUrl(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Button
              onClick={() => {
                handleUpdateClinic({
                  address: clinicAddress,
                  city: clinicCity,
                  clinicId: user?.clinicId!,
                  email: clinicEmail,
                  name: clinicName,
                  phone: clinicPhone,
                  state: clinicState,
                  zip: clinicZip,
                  website: clinicWebsiteUrl,
                });
              }}
              disabled={isUpdating}
            >
              <ButtonLoading isLoading={isUpdating} buttonText='Save Changes' />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
