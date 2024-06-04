'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ChevronDown,
  CirclePlus,
  Edit,
  ExternalLink,
  Ghost,
  Loader2,
  Settings,
  Trash,
} from 'lucide-react';
import UploadDocumentDialog from '../dialogs/UploadDocumentDialog';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteDocument, getClinicDocuments } from '@/actions/document.actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import EditDocumentDialog from '../dialogs/EditDocumentDialog';
import Link from 'next/link';
import { FcDocument, FcExport, FcFile, FcImport } from 'react-icons/fc';

const DocumentsPage = () => {
  const router = useRouter();
  const [isOpenUpload, setIsOpenUpload] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<TDocument>();
  const { data: documents, isLoading } = useQuery({
    queryKey: ['getClinicDocuments'],
    queryFn: async () => await getClinicDocuments(),
  });
  const { mutate: deleteAppointmentMutation, isPending: isDeleting } =
    useMutation({
      mutationKey: ['deleteDocument'],
      mutationFn: deleteDocument,
      onSuccess: () => {
        toast({
          title: 'Successfully deleted appointment',
          duration: 1500,
        });
      },
      onError: () => {
        toast({
          title: 'Failed to delete appointment',
          duration: 1500,
          description: 'Please try again later',
          variant: 'destructive',
        });
      },
    });

  console.log(documents);
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center justify-between w-full'>
        <p className='text-xl font-semibold'>Documents</p>
        <div className='flex items-center gap-2'>
          <Button
            className='hidden sm:flex items-center gap-2'
            onClick={() => setIsOpenUpload(true)}
          >
            <CirclePlus className='h-5 w-5' />
            <p>Upload Document</p>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant={'primary-outline'}
                className='flex items-center gap-2'
              >
                <p>Actions</p>
                <ChevronDown className='h-5 w-5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className='cursor-pointer sm:hidden flex items-center gap-2'
                onClick={() => setIsOpenUpload(true)}
              >
                <CirclePlus />
                <p>Upload Document</p>
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer flex items-center gap-2'>
                <FcImport />
                <p>Import from CSV</p>
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer flex items-center gap-2'>
                <FcExport />
                <p>Export to CSV</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {documents ? (
        <div className='md:flex hidden w-full'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead className='text-end'>Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents?.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>{document.title}</TableCell>
                  <TableCell>
                    {format(document?.createdAt, 'dd.MM.yyyy, HH:mm')}
                  </TableCell>
                  <TableCell>
                    {(document?.fileSize / 1000).toFixed(2)} KB
                  </TableCell>
                  <TableCell>
                    {document?.patient
                      ? `${document?.patient?.firstName} ${document?.patient.lastName}`
                      : 'No Data'}
                  </TableCell>
                  <TableCell>
                    <div className='flex justify-end'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size={'icon'} variant={'primary-outline'}>
                            <Settings />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            className='flex items-center gap-2'
                            onClick={() => {
                              setSelectedDocument(document);
                              setIsOpenEdit(true);
                            }}
                          >
                            <Edit className='h-4 w-4' />
                            <p>Edit Document</p>
                          </DropdownMenuItem>
                          <DropdownMenuItem className='flex items-center gap-2'>
                            <Link
                              href={document.linkUrl}
                              target='_blank'
                              className='flex items-center gap-2'
                            >
                              <ExternalLink className='h-4 w-4' />
                              <p>See Details</p>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              deleteAppointmentMutation(document.id)
                            }
                            className='flex items-center gap-2 text-red-500'
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <Loader2 className='h-4 w-4 animate-spin' />
                            ) : (
                              <Trash className='h-4 w-4' />
                            )}
                            <p>Delete Document</p>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className='mt-12 flex flex-col items-center justify-center gap-2 w-full'>
          <Ghost className='h-20 w-20 text-gray-400 dark:text-gray-600' />
          <p className='font-[500] text-gray-400 dark:text-gray-600'>
            No Documents
          </p>
        </div>
      )}
      <div className='md:hidden flex flex-row items-center justify-start w-full flex-wrap'>
        {documents?.map((d) => (
          <div
            onClick={() => {
              setSelectedDocument(d);
            }}
            onDoubleClick={() => {
              router.push(d.linkUrl);
            }}
            className={`${
              selectedDocument === d ? 'bg-blue-500/20 rounded-xl' : ''
            } px-4 py-2 flex flex-col gap-2 items-center justify-center`}
            key={d.id}
          >
            <FcFile className='sm:h-28 sm:w-28 h-20 w-20' />
            <p className='max-w-28 truncate text-sm'>{d.title}</p>
          </div>
        ))}
      </div>
      <UploadDocumentDialog open={isOpenUpload} setOpen={setIsOpenUpload} />
      <EditDocumentDialog
        open={isOpenEdit}
        setOpen={setIsOpenEdit}
        document={selectedDocument!}
      />
    </div>
  );
};

export default DocumentsPage;
