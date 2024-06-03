'use client';
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { chronicDiseases } from '@/constants';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../ui/command';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignChronicDiseaseToPatient } from '@/actions/disease.actions';
import { toast } from '../ui/use-toast';
import ButtonLoading from '../ButtonLoading';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  patientId: string;
  doctorId: string;
}

const AssignChronicDiseasToPatientDialog = ({
  open,
  setOpen,
  patientId,
  doctorId,
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDisesase, setSelectedDisease] = useState<string>('');
  const [diagonosis, setDiagonosis] = useState<string>('');
  const queryClient = useQueryClient();
  const {
    mutate: assignChronicDiseaseToPatientMutation,
    isPending: isAssinging,
  } = useMutation({
    mutationKey: ['assignChronicDiseaseToPatient'],
    mutationFn: assignChronicDiseaseToPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getPatients'],
        refetchType: 'all',
      });
      setOpen(false);
      toast({
        title: 'Chronic Disease assigned to patient',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Failed to assign Chronic Disease to patient',
        variant: 'destructive',
        description: 'Please try again later',
        duration: 1500,
      });
    },
  });
  if (!chronicDiseases) {
    return <p>loading</p>;
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col items-start justify-start w-full gap-4'>
        <p className='text-xl font-semibold'>Assign Disease to Patient</p>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Disease</Label>

          <Popover
            open={isOpen}
            onOpenChange={(v) => {
              if (!v) {
                setIsOpen(v);
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
                variant='outline'
                role='combobox'
                aria-expanded={isOpen}
                className='w-full justify-between'
              >
                {selectedDisesase !== ''
                  ? selectedDisesase
                  : 'Select Chronic Diseases'}

                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0 max-h-[300px] overflow-y-auto'>
              <Command>
                <CommandInput placeholder='Search disease...' />
                <CommandEmpty>No disease found.</CommandEmpty>
                <CommandGroup>
                  {chronicDiseases.map((d) => (
                    <CommandItem
                      key={d}
                      value={d}
                      onSelect={(d) => {
                        if (selectedDisesase === d) {
                          setSelectedDisease('');
                          setIsOpen(false);
                        } else {
                          setSelectedDisease(d);
                          setIsOpen(false);
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedDisesase === d ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {d}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Diagnosis</Label>
          <Textarea
            onChange={(e) => setDiagonosis(e.target.value)}
            className='resize-none'
            rows={8}
          />
        </div>
        <div className='flex items-center gap-2 w-full'>
          <Button
            variant={'primary-outline'}
            onClick={() => setOpen(false)}
            className='w-full'
            disabled={isAssinging}
          >
            Cancel
          </Button>
          <Button
            className='w-full'
            disabled={isAssinging}
            onClick={() => {
              assignChronicDiseaseToPatientMutation({
                patientId,
                disease: selectedDisesase,
                diagnosis: diagonosis,
                doctorId,
              });
            }}
          >
            <ButtonLoading isLoading={isAssinging} buttonText='Assign' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignChronicDiseasToPatientDialog;
