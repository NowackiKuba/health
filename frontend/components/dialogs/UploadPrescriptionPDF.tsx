'use client';
import useClinic from '@/hooks/useClinic';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { UploadDropzone } from '@/utils/uploadthing';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadDocument } from '@/actions/document.actions';
import { toast } from '../ui/use-toast';
import ButtonLoading from '../ButtonLoading';
import { FcDocument } from 'react-icons/fc';
import { Loader2, UploadIcon, X } from 'lucide-react';
import { createPrescription } from '@/actions/prescription.action';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  doctor: TEmployee;
  patient: TPatient;
}

const UploadPrescriptionPDFDialog = ({
  open,
  setOpen,
  patient,
  doctor,
}: Props) => {
  const { clinic, isLoading } = useClinic();
  const [url, setUrl] = useState<string>('');
  const [title, setTitle] = useState<string | undefined>();

  const queryClient = useQueryClient();
  const { mutate: handleUpload, isPending: isUploading } = useMutation({
    mutationKey: ['uploadPrescription'],
    mutationFn: createPrescription,
    onSuccess: () => {
      setOpen(false);
      toast({
        title: 'Successfully uploaded prescription',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Failed to upload prescription',
        duration: 1500,
        description: 'Please try again later',
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
      <DialogContent className='flex flex-col gap-4 w-full'>
        <p className='text-xl font-semibold'>Upload Prescription</p>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Prescription</Label>
          {url === '' ? (
            <UploadDropzone
              endpoint='documentUploader'
              config={{
                mode: 'auto',
              }}
              content={{
                uploadIcon({ isUploading }) {
                  if (isUploading) {
                    return <Loader2 className='h-12 w-12 animate-spin' />;
                  }
                  return <UploadIcon className='h-12 w-12' />;
                },
              }}
              appearance={{
                container:
                  ' border border-border border-dashed border-gray-300 rounded-lg p-4',
                button: 'hidden',
              }}
              onClientUploadComplete={(res) => {
                setUrl(res[0].url);
              }}
            />
          ) : (
            <div className='flex items-center w-full'>
              <div className='flex flex-col'>
                <div className='absolute'>
                  <X
                    className='text-red-500 cursor-pointer'
                    onClick={() => {
                      setUrl('');
                    }}
                  />
                </div>
                <FcDocument className='h-24 w-24 ml-2' />
              </div>
              <div className='flex flex-col'></div>
            </div>
          )}
        </div>

        <div className='flex items-center gap-2 w-full'>
          <Button
            onClick={() => setOpen(false)}
            className='w-full'
            variant={'primary-outline'}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            disabled={isUploading}
            onClick={() => {
              handleUpload({
                clinicId: clinic?.id!,
                employeeId: doctor.id,
                patientId: patient.id,
                url,
              });
            }}
            className='w-full'
          >
            <ButtonLoading isLoading={isUploading} buttonText='Upload' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPrescriptionPDFDialog;
