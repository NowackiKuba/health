import { Loader2 } from 'lucide-react';
import React from 'react';

interface Props {
  buttonText: string;
  isLoading: boolean;
}

const ButtonLoading = ({ isLoading, buttonText }: Props) => {
  return (
    <>
      {isLoading ? (
        <div className='flex items-center gap-1'>
          <Loader2 className='h-4 w-4 animate-spin' />
          <p>{buttonText}</p>
        </div>
      ) : (
        buttonText
      )}
    </>
  );
};

export default ButtonLoading;
