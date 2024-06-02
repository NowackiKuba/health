import React from 'react';
import { Button } from '../ui/button';

const DocumentsPage = () => {
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center justify-between w-full'>
        <p className='text-xl font-semibold'>Documents</p>
        <div className='flex items-center gap-2'>
          <Button className='flex items-center gap-2'></Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
