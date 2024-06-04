import React, { forwardRef } from 'react';
import { Checkbox } from './ui/checkbox';
import { format } from 'date-fns';

interface Props {
  doctor: TEmployee;
  patient: TPatient;
  clinic: TClinic;
}

const HospitalReferall = forwardRef(
  ({ doctor, patient, clinic }: Props, ref: any) => {
    return (
      <div
        ref={ref}
        className='flex flex-col py-8 px-20 items-center justify-center gap-1 w-full text-black bg-white'
      >
        <div className='flex  border border-black w-full flex-col items-start justify-start'>
          <div className='w-full py-1 px-2 bg-gray-100 '>
            <p className='font-semibold uppercase'>referral information</p>
          </div>
          <div className='flex items-center w-full'>
            <div className='border border-black border-l-0 w-1/2 p-1'>
              <p className='text-sm'>
                Date of referral:{' '}
                <span className='font-[500]'>
                  {format(new Date(), 'dd.MM.yyyy')}
                </span>
              </p>
            </div>
            <div className='border border-black border-r-0 border-l-0 w-1/2 p-1'>
              <p className='text-sm'>Referring hospital: {clinic?.name}</p>
            </div>
          </div>
          <div className='flex items-center w-full'>
            <div className='border border-black border-t-0 border-l-0 w-1/2 p-1'>
              <p className='text-sm'>
                Referring doctor: {doctor.firstName} {doctor.lastName}
              </p>
            </div>
            <div className='border border-black border-r-0 border-t-0 border-l-0 w-1/2 p-1'>
              <p className='text-sm'>Referring ward: </p>
            </div>
          </div>
          <div className='flex items-center w-full'>
            <div className='border border-black border-t-0 border-l-0 w-1/2 p-1'>
              <p className='text-sm'>
                Doctor&apos; mobile number: {doctor.phone}
              </p>
            </div>
            <div className='border border-black border-r-0 border-t-0 border-l-0 w-1/2 p-1'>
              <p className='text-sm'>Referring department/sepciality: </p>
            </div>
          </div>
          <div className='flex items-center w-full'>
            <div className='border border-black border-t-0 border-l-0 w-1/2 p-1'>
              <p className='text-sm'>Doctor&apos;s email: {doctor.email}</p>
            </div>
            <div className='border border-black border-r-0 border-t-0 border-l-0 w-1/2 p-1'>
              <p className='text-sm'>Ward telephone number: </p>
            </div>
          </div>
          <div className='w-full py-1 px-2 bg-gray-100 '>
            <p className='font-semibold uppercase'>patient information</p>
          </div>
          <div className='flex items-center w-full'>
            <div className='border border-black border-l-0 w-1/2 p-1'>
              <p className='text-sm'>Hospital number: </p>
            </div>
            <div className='border border-black border-r-0 border-l-0 w-1/2 p-1'>
              <p className='text-sm'>
                Date of birth: {format(patient.dateOfBirth, 'dd.MM.yyyy')}
              </p>
            </div>
          </div>
          <div className='flex items-center w-full'>
            <div className='border border-black border-t-0 border-l-0 w-1/2 p-1'>
              <p className='text-sm'>Surname: {patient.lastName}</p>
            </div>
            <div className='border border-black border-r-0 border-t-0 border-l-0 w-1/2 p-1'>
              <p className='text-sm'>First Name: {patient.firstName}</p>
            </div>
          </div>
          <div className='flex items-center w-full'>
            <div className='flex items-center w-full'>
              <div className='border border-black border-t-0 border-l-0 w-1/2 p-1'>
                <p className='text-sm'>Gender: </p>
              </div>
              <div className='border border-black border-t-0 border-l-0 w-1/2 p-1'>
                <p className='text-sm'>Race: </p>
              </div>
            </div>
            <div className='border border-black border-r-0 border-t-0 border-l-0 w-full p-1'>
              <p className='text-sm'>Home language: </p>
            </div>
          </div>
          <div className='flex items-center w-full'>
            <div className='border border-black border-t-0 border-l-0 w-full p-1'>
              <p className='text-sm'>Address: {patient.address || ''} </p>
            </div>
          </div>
          <div className='w-full py-1 px-2 bg-gray-100 '>
            <p className='font-semibold uppercase'>
              caregiver&apos;s information
            </p>
          </div>
          <div className='flex items-center w-full'>
            <div className='border border-black border-l-0 w-1/2 p-1'>
              <p className='text-sm'>Fullname: </p>
            </div>
            <div className='border border-black border-r-0 border-l-0 w-1/2 p-1'>
              <p className='text-sm'>Relationship to patient: </p>
            </div>
          </div>
          <div className='flex items-center w-full'>
            <div className='border border-black border-t-0 border-l-0 w-1/2 p-1'>
              <p className='text-sm'>Contact number: </p>
            </div>
            <div className='border border-black border-r-0 border-t-0 border-l-0 w-1/2 p-1'>
              <p className='text-sm'>Alternative contact number: </p>
            </div>
          </div>
          <div className='w-full py-1 px-2 bg-gray-100 '>
            <p className='font-semibold uppercase'>
              patient needs <span className='lowercase'>(please tick)</span>
            </p>
          </div>
          <div className='flex text-xs flex-row items-center justify-start w-full flex-wrap'>
            <div className='text-center text-sm flex flex-col items-center justify-center w-[12.5%] h-12 border border-black'>
              Advance Care Plan (ACP)
            </div>
            <div className='text-center text-sm flex flex-col items-center justify-center w-[12.5%] h-12 border border-black'>
              Bearevement Support
            </div>
            <div className='text-center text-sm flex flex-col items-center justify-center w-[12.5%] h-12 border border-black'>
              Clinical/Symptom Review
            </div>
            <div className='text-center text-sm flex flex-col items-center justify-center w-[12.5%] h-12 border border-black'>
              Family Counselling
            </div>
            <div className='text-center text-sm flex flex-col items-center justify-center w-[12.5%] h-12 border border-black'>
              MDT
            </div>
            <div className='text-center text-sm flex flex-col items-center justify-center w-[12.5%] h-12 border border-black'>
              Patient Training
            </div>
            <div className='text-center text-sm flex flex-col items-center justify-center w-[12.5%] h-12 border border-black'>
              Social Work
            </div>
            <div className='text-center text-sm flex flex-col items-center justify-center w-[12.5%] h-12 border border-black'>
              Art Therapy
            </div>
            <div className='flex flex-col items-center justify-center text-sm w-[12.5%] h-12 border border-black border-t-0'>
              Bearevement Counselling
            </div>
            <div className='flex flex-col items-center justify-center text-sm w-[12.5%] h-12 border border-black border-t-0'>
              Case Meeting
            </div>
            <div className='flex flex-col items-center justify-center text-sm w-[12.5%] h-12 border border-black border-t-0'>
              End of Life Care
            </div>
            <div className='flex flex-col items-center justify-center text-sm w-[12.5%] h-12 border border-black border-t-0'>
              Home Visit
            </div>
            <div className='flex flex-col items-center justify-center text-sm w-[12.5%] h-12 border border-black border-t-0'>
              Medicak Counselling
            </div>
            <div className='flex flex-col items-center justify-center text-sm w-[12.5%] h-12 border border-black border-t-0'>
              Professional Training
            </div>
            <div className='flex flex-col items-center justify-center text-sm w-[12.5%] h-12 border border-black border-t-0'>
              Aromatherapy
            </div>
            <div className='flex flex-col items-center justify-center text-sm w-[12.5%] h-12 border border-black border-t-0'>
              Music Therapy
            </div>
          </div>
        </div>
        <div className='flex  border border-black w-full flex-col items-start justify-start'>
          <div className='flex items-center w-full'>
            <div className='p-1 w-1/2 border border-black border-t-0 bg-gray-100 uppercase font-semibold'>
              primary diagnoses: (Please indicate dates of diagnosis)
            </div>
            <div className='p-1 w-1/2 border border-black border-t-0 bg-gray-100 uppercase font-semibold'>
              secondary diagnoses: (Please indicate dates of diagnosis)
            </div>
          </div>
          <div className='flex items-center w-full'>
            <div className='h-44 border border-l-0 border-r-0 w-1/2'>
              <p className='text-sm font-semibold'>
                Please indicate if diagnosis is not established/sure
              </p>
            </div>
            <div className='h-44 border-l border-black w-1/2'></div>
          </div>
          <div className='w-full flex items-center text-sm'>
            <div className='border border-black w-1/2 p-1'>ICD10 Code</div>
            <div className='border border-black w-1/2 p-1'>ICD10 Code</div>
          </div>
          <div className='flex items-center w-full text-sm'>
            <div className='border p-1 border-black w-full'>
              <p className='font-semibold text-xs'>Act Classification</p>
            </div>
            <div className='border p-1 border-black w-full'>Act 0</div>
            <div className='border p-1 border-black w-full'>Act I</div>
            <div className='border p-1 border-black w-full'>Act II</div>
            <div className='border p-1 border-black w-full'>Act III</div>
            <div className='border p-1 border-black w-full'>Act IV</div>
          </div>
          <div className='flex items-center w-full text-sm'>
            <div className='border p-1 border-black w-full'>
              <p className='font-semibold text-xs'>Stage of Disease</p>
            </div>
            <div className='border p-1 border-black w-full'>Early</div>
            <div className='border p-1 border-black w-full'>Middle</div>
            <div className='border p-1 border-black w-full'>Advanced</div>
            <div className='border p-1 border-black w-full'>Pre-terminal</div>
            <div className='border p-1 border-black w-full'>Unsure</div>
          </div>
          <div className='border border-black w-full p-1 bg-gray-100 uppercase'>
            complications/other problems (including social)
          </div>
          <div className='flex items-center w-full text-sm'>
            <div className='flex flex-col w-1/2'>
              <div className='bg-gray-100 p-1 w-full border border-black font-semibold text-center'>
                Liver FX
              </div>
              <div className='w-full flex items-center'>
                <div className='p-1 border w-full border-black'>Normal</div>
                <div className='p-1 border w-full border-black'>Dysfyx</div>
                <div className='p-1 border w-full border-black'>Failure</div>
                <div className='p-1 border w-full border-black'>Not known</div>
              </div>
              <div className='w-full bg-gray-100 p-1 font-semibold'>
                DISEASE MODIFYING TREATMENTS (e.g. HAART)
              </div>
              <div className='border border-black w-full h-28'></div>
              <div className='w-full bg-gray-100 p-1 font-semibold'>
                SYMPTOM REVIEW
              </div>
              <div className='border border-black w-full h-44'>
                <div className='flex items-center justify-between py-4 px-4 w-full h-full'>
                  <div className='flex flex-col justify-between h-full'>
                    <div className='flex items-center gap-2'>
                      <p>Pain (tick if present)</p>
                      <Checkbox />
                    </div>
                    <p>Pain Score: </p>
                  </div>
                  <div className='flex flex-col'>
                    <div className='w-full border text-center border-black px-6'>
                      SCORE USED
                    </div>
                    <div className='flex items-center '>
                      <div className='border border-black w-1/2 p-1'>FLACC</div>
                      <div className='border border-black w-1/2 p-3.5'></div>
                    </div>
                    <div className='flex items-center '>
                      <div className='border border-black w-1/2 p-1'>FACES</div>
                      <div className='border border-black w-1/2 p-3.5'></div>
                    </div>
                    <div className='flex items-center '>
                      <div className='border border-black w-1/2 p-1'>NIPS</div>
                      <div className='border border-black w-1/2 p-3.5'></div>
                    </div>
                    <div className='flex items-center '>
                      <div className='border border-black w-1/2 p-1'>ELAND</div>
                      <div className='border border-black w-1/2 p-3.5'></div>
                    </div>
                  </div>
                </div>
                <div className='w-full bg-gray-100 p-1 font-semibold uppercase border border-black'>
                  child&apos;s understanding of illness
                </div>
                <div className='border border-black w-full h-20'></div>
                <div className='w-full bg-gray-100 p-1 font-semibold uppercase border border-black'>
                  Intervention level
                </div>
                <div className='flex w-full items-center'>
                  <div className='border border-black p-2 w-full'>
                    Undecided
                  </div>
                  <div className='border border-black p-2 w-full'>1</div>
                  <div className='border border-black p-2 w-full'>2</div>
                  <div className='border border-black p-2 w-full'>3</div>
                </div>
              </div>
            </div>
            <div className='flex flex-col w-1/2'>
              <div className='bg-gray-100 p-1 mt-[174px]  w-full border border-black font-semibold text-center'>
                Renal FX
              </div>
              <div className='w-full flex items-center'>
                <div className='p-1 border w-full border-black'>Normal</div>
                <div className='p-1 border w-full border-black'>Dysfyx</div>
                <div className='p-1 border w-full border-black'>Failure</div>
                <div className='p-1 border w-full border-black'>Not known</div>
              </div>
              <div className='w-full bg-gray-100 p-1 font-semibold uppercase'>
                pain and symptom control drugs
              </div>
              <div className='border border-black w-full h-28'></div>
              <div className='w-full bg-gray-100 p-1 font-semibold uppercase'>
                symptoms other than pain:{' '}
                <span className='lowercase'>Please list</span>
              </div>
              <div className='border border-black w-full h-44'></div>
              <div className='w-full bg-gray-100 p-1 font-semibold uppercase'>
                child&apos;s understanding of illness
              </div>
              <div className='border border-black w-full h-20'></div>
              <div className='w-full bg-gray-100 p-1 font-semibold uppercase'>
                Intervention level
              </div>
              <div className='flex w-full items-center'>
                <div className='border border-black p-2 w-full'>Undecided</div>
                <div className='border border-black p-2 w-full'>1</div>
                <div className='border border-black p-2 w-full'>2</div>
                <div className='border border-black p-2 w-full'>3</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

HospitalReferall.displayName = 'HospitalReferall';
export default HospitalReferall;
