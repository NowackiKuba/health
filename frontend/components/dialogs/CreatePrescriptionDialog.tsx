import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { FaPrescriptionBottle } from 'react-icons/fa';
import Prescription from '../Prescription';
import { useReactToPrint } from 'react-to-print';

import { Input } from '../ui/input';

interface Props {
  doctor: TEmployee;
  open: boolean;
  patient: TPatient;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const CreatePrescriptionDialog = ({
  doctor,
  patient,
  setOpen,
  open,
}: Props) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current!,
    documentTitle: `Prescription-${patient?.firstName} ${patient?.lastName}`,
  });
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const handleGenerateSeed = (len: number) => {
    let seed = '';
    for (let i = 0; i < len; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      const randomDigit = numbers[randomIndex];
      seed += randomDigit.toString();
    }
    return seed;
  };
  const [medicineArray, setMedicineArray] = useState<TMedicine[]>([]);
  const [medicine, setMedicine] = useState<TMedicine>();
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex gap-3 w-full flex-col'>
        {medicineArray?.length > 0 && (
          <div className='flex flex-col  w-full gap-3 rounded-xl'>
            {medicineArray.map((m) => (
              <div
                key={m.seed}
                className='w-full p-2 bg-secondary rounded-xl gap-2 flex flex-col'
              >
                <div className='h-16 w-16 flex items-center rounded-xl justify-center bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200'>
                  <FaPrescriptionBottle className='h-8 w-8 ' />
                </div>
                <div className='flex flex-col'>
                  <p className='font-semibold'>{m.name}</p>
                  <p>{m.quantity}</p>
                  <p>
                    {m.dose} x {m.frequency}, {m.duration} days
                  </p>
                  <p>{m.discount === 0 ? 'None' : `${m.discount}%`}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {!medicine && (
          <div className='flex items-center gap-2 w-full'>
            <Button
              variant={'primary-outline'}
              className='w-full'
              onClick={() =>
                setMedicine({
                  name: '',
                  quantity: 0,
                  dose: '',
                  frequency: '',
                  duration: '',
                  seed: handleGenerateSeed(16),
                  discount: 0,
                })
              }
            >
              Add Medicine
            </Button>
            {medicineArray?.length > 0 && (
              <Button className='w-full' onClick={() => handlePrint()}>
                Print Prescription
              </Button>
            )}
          </div>
        )}
        {medicine && (
          <>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>Medicine Name</Label>
              <Input
                onChange={(e) =>
                  setMedicine({
                    discount: medicine?.discount!,
                    dose: medicine?.dose!,
                    duration: medicine?.duration!,
                    frequency: medicine?.frequency!,
                    name: e.target.value,
                    quantity: medicine?.quantity!,
                    seed: medicine?.seed!,
                  })
                }
              />
            </div>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>Medicine Quantity</Label>
              <Input
                onChange={(e) =>
                  setMedicine({
                    discount: medicine?.discount!,
                    dose: medicine?.dose!,
                    duration: medicine?.duration!,
                    frequency: medicine?.frequency!,
                    name: medicine?.name!,
                    quantity: parseInt(e.target.value),
                    seed: medicine?.seed!,
                  })
                }
              />
            </div>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>Medicine Dose</Label>
              <Input
                onChange={(e) =>
                  setMedicine({
                    discount: medicine?.discount!,
                    dose: e.target.value,
                    duration: medicine?.duration!,
                    frequency: medicine?.frequency!,
                    name: medicine?.name!,
                    quantity: medicine?.quantity!,
                    seed: medicine?.seed!,
                  })
                }
              />
            </div>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>Medicine Frequency</Label>
              <Input
                onChange={(e) =>
                  setMedicine({
                    discount: medicine?.discount!,
                    dose: medicine?.dose!,
                    duration: medicine?.duration!,
                    frequency: e.target.value,
                    name: medicine?.name!,
                    quantity: medicine?.quantity!,
                    seed: medicine?.seed!,
                  })
                }
              />
            </div>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>Duration</Label>
              <Input
                onChange={(e) =>
                  setMedicine({
                    discount: medicine?.discount!,
                    dose: medicine?.dose!,
                    duration: e.target.value,
                    frequency: medicine?.frequency!,
                    name: medicine?.name!,
                    quantity: medicine?.quantity!,
                    seed: medicine?.seed!,
                  })
                }
              />
            </div>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>Discount (Leave empty if not applied)</Label>
              <Input
                onChange={(e) =>
                  setMedicine({
                    discount: +e.target.value,
                    dose: medicine?.dose!,
                    duration: medicine?.duration!,
                    frequency: medicine?.frequency!,
                    name: medicine?.name!,
                    quantity: medicine?.quantity!,
                    seed: medicine?.seed!,
                  })
                }
              />
            </div>
            <div className='flex items-center gap-2 w-full'>
              <Button
                className='w-full'
                variant={'primary-outline'}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className='w-full'
                onClick={() => {
                  setMedicineArray([...medicineArray, medicine!]);
                  setMedicine(undefined);
                }}
              >
                Add Medicine
              </Button>
            </div>
          </>
        )}
      </DialogContent>
      <div className='hidden'>
        <Prescription
          ref={componentRef}
          medicineArray={medicineArray}
          prescriptionCode={+handleGenerateSeed(4)}
          patient={patient}
          doctor={doctor}
        />
      </div>
    </Dialog>
  );
};
