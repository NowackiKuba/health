'use client';
import React, {
  Dispatch,
  DispatchWithoutAction,
  SetStateAction,
  useState,
} from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Eye, EyeOff } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEmployeeAccount } from '@/actions/employee.actions';
import { toast } from '../ui/use-toast';
import ButtonLoading from '../ButtonLoading';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateEmployeeDialog = ({ open, setOpen }: Props) => {
  //     firstName
  // lastName
  // email
  // phone
  // role
  // password
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { mutate: createAccount, isPending: isCreating } = useMutation({
    mutationKey: ['createEmployeeAccount'],
    mutationFn: createEmployeeAccount,
    onSuccess: () => {
      toast({
        title: 'Successfully created employee account',
        description: 'The employee account has been created successfully',
        duration: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: ['getClinicEmployees'],
        refetchType: 'all',
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'Error creating employee account',
        description: 'An error occurred while creating the employee account',
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
      <DialogContent className='flex flex-col gap-3 w-full'>
        <p className='text-xl font-semibold'>Create Employee Account</p>
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
          <Label>Phone</Label>
          <Input
            onChange={(e) => setPhone(e.target.value)}
            defaultValue={phone}
          />
        </div>
        <div className='flex items-end gap-2 w-full'>
          <div className='flex flex-col gap-0.5 w-full'>
            <Label>Password</Label>
            <Input
              type={isPasswordVisible ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
              defaultValue={password}
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
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Role</Label>
          <Select onValueChange={(e) => setRole(e)}>
            <SelectTrigger>
              <SelectValue placeholder='Select Role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ADMIN'>Admin</SelectItem>
              <SelectItem value='DOCTOR'>Doctor</SelectItem>
              <SelectItem value='RECEPTIONIST'>Receptionist</SelectItem>
            </SelectContent>
          </Select>
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
            onClick={() => {
              createAccount({
                email,
                firstName,
                lastName,
                password,
                phone,
                role,
              });
            }}
            className='w-full'
            disabled={isCreating}
          >
            <ButtonLoading isLoading={isCreating} buttonText='Create Account' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeDialog;
