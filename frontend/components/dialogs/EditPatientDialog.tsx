import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import ButtonLoading from '../ButtonLoading';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ICreatePatientData } from './CreatePatientDialog';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { editPatient, getPatientById } from '@/actions/patient.actions';
import { toast } from '../ui/use-toast';
import { usePatient } from '@/hooks/usePatient';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  patientId: string;
}

const EditPatientDialog = ({ open, setOpen, patientId }: Props) => {
  const { patient, isLoading } = usePatient({ patientId });

  const [patientData, setPatientData] = useState<ICreatePatientData>({
    address: '',
    city: '',
    email: '',
    firstName: '',
    lastName: '',
    pesel: '',
    phone: '',
    state: '',
    zip: '',
  });

  useEffect(() => {
    if (!patient) return;

    setPatientData({
      address: patient.address || '',
      city: patient.city || '',
      email: patient.email,
      firstName: patient.firstName,
      lastName: patient.lastName,
      pesel: '',
      phone: patient.phone || '',
      state: patient.state || '',
      zip: patient.zip || '',
    });
  }, [patient]);
  const queryClient = useQueryClient();
  const { mutate: editPatientMutation, isPending: isEditing } = useMutation({
    mutationKey: ['editPatientMutation'],
    mutationFn: editPatient,
    onSuccess: () => {
      toast({
        title: 'Successfully edit patient account',
        description: 'The patient account has been edited successfully',
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
        title: 'Error editing patient account',
        description: 'An error occurred while editing the patient account',
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
        <div className='flex items-center gap-2 w-full'>
          <div className='flex flex-col gap-0.5 w-full'>
            <Label>First Name</Label>
            <Input
              defaultValue={patientData.firstName || ''}
              onChange={(e) =>
                setPatientData({ ...patientData, firstName: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col gap-0.5 w-full'>
            <Label>Last Name</Label>
            <Input
              defaultValue={patientData.lastName || ''}
              onChange={(e) =>
                setPatientData({ ...patientData, lastName: e.target.value })
              }
            />
          </div>
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Email Address</Label>
          <Input
            defaultValue={patientData.email}
            onChange={(e) =>
              setPatientData({ ...patientData, email: e.target.value })
            }
          />
        </div>
        <Label>Phone Number (optional)</Label>
        <Input
          defaultValue={patientData.phone || ''}
          onChange={(e) =>
            setPatientData({ ...patientData, phone: e.target.value })
          }
        />
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Address (optional)</Label>
          <Input
            defaultValue={patientData.address || ''}
            onChange={(e) =>
              setPatientData({ ...patientData, address: e.target.value })
            }
          />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>City (optional)</Label>
          <Input
            defaultValue={patientData.city || ''}
            onChange={(e) =>
              setPatientData({ ...patientData, city: e.target.value })
            }
          />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>State (optional)</Label>
          <Input
            defaultValue={patientData.state || ''}
            onChange={(e) =>
              setPatientData({ ...patientData, state: e.target.value })
            }
          />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Zip (optional)</Label>
          <Input
            defaultValue={patientData.zip || ''}
            onChange={(e) =>
              setPatientData({ ...patientData, zip: e.target.value })
            }
          />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>PESEL Number</Label>
          <Input
            defaultValue={patientData.pesel}
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
            disabled={isEditing}
          >
            Cancel
          </Button>
          <Button
            className='w-full'
            disabled={isEditing}
            onClick={() => {
              editPatientMutation({
                city: patientData.city ? patientData.city : patient?.city!,
                email: patientData.email,
                firstName: patientData.firstName,
                lastName: patientData.lastName,
                patientId: patientId,
                pesel:
                  patientData.pesel === ''
                    ? patient?.pesel!
                    : patientData.pesel,
                phone: patientData.phone ? patientData.phone : patient?.phone!,
                state: patientData.state ? patientData.state : patient?.state!,
                zip: patientData.zip ? patientData.zip : patient?.zip!,
              });
            }}
          >
            <ButtonLoading buttonText='Edit' isLoading={isEditing} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPatientDialog;
