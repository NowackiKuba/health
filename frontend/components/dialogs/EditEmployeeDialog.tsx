import axios from 'axios';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { useEmployee } from '@/hooks/useEmployee';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { SelectValue } from '@radix-ui/react-select';
import { Button } from '../ui/button';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editEmployee } from '@/actions/employee.actions';
import { toast } from '../ui/use-toast';
import ButtonLoading from '../ButtonLoading';
import { UploadButton } from '@/utils/uploadthing';
import { Loader2, UploadCloud } from 'lucide-react';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  employeeId: string;
}

const EditEmployeeDialog = ({ employeeId, open, setOpen }: Props) => {
  const { employee, isLoading } = useEmployee({ employeeId });
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [workingRoom, setWorkingRoom] = useState<string>('');
  const queryClient = useQueryClient();
  const { mutate: handleEdit, isPending: isEditing } = useMutation({
    mutationKey: ['editEmployee'],
    mutationFn: editEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getClinicEmployees'],
        refetchType: 'all',
      });
      setOpen(false);
      toast({
        title: 'Successfully updated employee',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Something went wrong while updating employee',
        description: 'Please try again later',
        duration: 1500,
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (!employee) return;
    setFirstName(employee.firstName);
    setLastName(employee.lastName);
    setEmail(employee.email);
    setPhone(employee.phone);
    setRole(employee.role.toString());
    setImage(employee.imgUrl || '');
    setWorkingRoom(employee?.room || '');
  }, [employee]);
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col gap-5 w-full'>
        <p className='text-lg font-semibold'>Edit Employee Account</p>
        {image === '' ? (
          <>
            {employee?.imgUrl ? (
              <>
                <Image
                  alt='profile'
                  src={employee?.imgUrl}
                  width={500}
                  height={500}
                  className='h-36 w-36 rounded-full'
                />
              </>
            ) : (
              <div className='group w-36 cursor-pointer'>
                <div className='h-36 w-36 rounded-full absolute bg-black/50 backdrop-blur-sm hidden group-hover:flex items-center justify-center'>
                  <UploadButton
                    endpoint='imageUploader'
                    appearance={{
                      allowedContent: 'hidden',
                      button: 'bg-transparent h-28 w-28',
                    }}
                    content={{
                      button({ isUploading, uploadProgress }) {
                        if (isUploading) {
                          return (
                            <div className='flex flex-col items-center justify-center gap-2'>
                              <Loader2 className='h-12 w-12 animate-spin' />
                              <p>{uploadProgress}%</p>
                            </div>
                          );
                        } else {
                          return <UploadCloud className='h-14 w-14' />;
                        }
                      },
                    }}
                    onClientUploadComplete={(res) => {
                      setImage(res[0].url);
                    }}
                  />
                </div>
                <div className='flex items-center justify-center text-4xl font-bold rounded-full h-36 w-36 bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200'>
                  {employee?.firstName.charAt(0)}
                  {employee?.lastName.charAt(0)}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className='flex flex-col gap-1 w-full'>
            <Image
              alt='profile'
              src={image}
              width={500}
              height={500}
              className='h-36 w-36 rounded-full'
            />
            <div className='flex items-center gap-2 max-w-40'>
              <Button variant={'primary-outline'} className='w-full'>
                Edit
              </Button>
              <Button variant={'destructive'} className='w-full'>
                Delete
              </Button>
            </div>
          </div>
        )}

        <div className='flex items-center gap-2 w-full'>
          <div className='flex flex-col gap-0.5 w-full'>
            <Label>First Name</Label>
            <Input
              onChange={(e) => setFirstName(e.target.value)}
              defaultValue={firstName}
            />
          </div>
          <div className='flex flex-col gap-0.5 w-full'>
            <Label>Last Name</Label>
            <Input
              onChange={(e) => setLastName(e.target.value)}
              defaultValue={lastName}
            />
          </div>
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Email</Label>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            defaultValue={email}
          />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Phone Number</Label>
          <Input
            onChange={(e) => setPhone(e.target.value)}
            defaultValue={phone}
          />
        </div>
        <div className='flex items-center gap-2 w-full'>
          <div className='flex flex-col gap-0.5 w-full'>
            <Label>Role</Label>
            <Select onValueChange={(e) => setRole(e)}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Role' className='w-full' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ADMIN'>Admin</SelectItem>
                <SelectItem value='DOCTOR'>Doctor</SelectItem>
                <SelectItem value='RECEPTIONIST'>Receptionist</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col gap-0.5 w-full'>
            <Label>Working Room (optional)</Label>
            <Input
              //   className='max-w-[142px]'
              onChange={(e) => setWorkingRoom(e.target.value)}
              defaultValue={workingRoom}
            />
          </div>
        </div>
        <div className='flex items-center gap-2 w-full mt-3'>
          <Button
            variant={'primary-outline'}
            onClick={() => setOpen(false)}
            className='w-full'
            disabled={isEditing}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleEdit({
                email,
                employeeId,
                firstName,
                imgUrl: image,
                lastName,
                phone,
                role,
                room: workingRoom,
              });
            }}
            className='w-full'
            disabled={isEditing}
          >
            <ButtonLoading buttonText='Edit' isLoading={isEditing} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeDialog;
