'use client';
import React, { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  service: TService;
}

const ServiceDetailsDialog = ({ open, setOpen, service }: Props) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col w-full gap-3'></DialogContent>
    </Dialog>
  );
};

export default ServiceDetailsDialog;
