import React, { Dispatch, DispatchWithoutAction, SetStateAction } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  patientId: string;
  clinicDoctors: TEmployee[];
}

const CreateAppointmentDialog = ({
  open,
  setOpen,
  patientId,
  clinicDoctors,
}: Props) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent></DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentDialog;
