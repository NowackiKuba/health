import React, { Dispatch, SetStateAction, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { createPatientAccount } from '@/actions/clinic.actions';
import { useToast } from '../ui/use-toast';
import ButtonLoading from '../ButtonLoading';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export interface ICreatePatientData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  pesel: string;
}
const CreatePatientDialog = ({ open, setOpen }: Props) => {
  const [patientData, setPatientData] = useState<ICreatePatientData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: null,
    address: null,
    city: null,
    state: null,
    zip: null,
    pesel: '',
  });
  const queryClient = new QueryClient();
  const { toast } = useToast();
  const { mutate: createAccount, isPending: isCreating } = useMutation({
    mutationKey: ['createPatientAccount'],
    mutationFn: createPatientAccount,
    onSuccess: () => {
      toast({
        title: 'Successfully created patient account',
        description: 'The patient account has been created successfully',
        duration: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: ['getClinicPatients'],
        refetchType: 'all',
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'Error creating patient account',
        description: 'An error occurred while creating the patient account',
        duration: 1500,
        variant: 'destructive',
      });
    },
  });
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex xl:max-h-[750px] overflow-y-auto items-start flex-col gap-3 w-full'>
        <p className='text-xl font-semibold'>Create Patient Account</p>
        <div className='flex items-center gap-2 w-full'>
          <div className='flex flex-col gap-0.5 w-full'>
            <Label>First Name</Label>
            <Input
              onChange={(e) =>
                setPatientData({ ...patientData, firstName: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col gap-0.5 w-full'>
            <Label>Last Name</Label>
            <Input
              onChange={(e) =>
                setPatientData({ ...patientData, lastName: e.target.value })
              }
            />
          </div>
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Email Address</Label>
          <Input
            onChange={(e) =>
              setPatientData({ ...patientData, email: e.target.value })
            }
          />
        </div>
        <Label>Phone Number (optional)</Label>
        <Input
          onChange={(e) =>
            setPatientData({ ...patientData, phone: e.target.value })
          }
        />
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Address (optional)</Label>
          <Input
            onChange={(e) =>
              setPatientData({ ...patientData, address: e.target.value })
            }
          />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>City (optional)</Label>
          <Input
            onChange={(e) =>
              setPatientData({ ...patientData, city: e.target.value })
            }
          />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>State (optional)</Label>
          <Input
            onChange={(e) =>
              setPatientData({ ...patientData, state: e.target.value })
            }
          />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Zip (optional)</Label>
          <Input
            onChange={(e) =>
              setPatientData({ ...patientData, zip: e.target.value })
            }
          />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>PESEL Number</Label>
          <Input
            onChange={(e) =>
              setPatientData({ ...patientData, pesel: e.target.value })
            }
          />
        </div>
        <div className='flex items-center gap-2 w-full'>
          <Button
            variant={'primary-outline'}
            onClick={() => setOpen(false)}
            className='w-full'
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            className='w-full'
            disabled={isCreating}
            onClick={() => {
              createAccount({
                data: patientData,
              });
            }}
          >
            <ButtonLoading buttonText='Create' isLoading={isCreating} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePatientDialog;
