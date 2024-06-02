import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { UploadDropzone } from '@/utils/uploadthing';
import { Loader2, UploadIcon, X } from 'lucide-react';
import { FcDocument } from 'react-icons/fc';
import { Button } from '../ui/button';
import ButtonLoading from '../ButtonLoading';
import { editDocument } from '@/actions/document.actions';
import { toast } from '../ui/use-toast';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  document: TDocument;
}

const EditDocumentDialog = ({ open, setOpen, document }: Props) => {
  const [documentUrl, setDocumentUrl] = useState<string>('');
  const [title, setTitle] = useState<string | undefined>();
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);

  useEffect(() => {
    if (!document) return document;
    setDocumentUrl(document.linkUrl);
    setTitle(document.title);
    setFileName(document.title);
    setFileSize(document.fileSize);
  }, [document]);
  const queryClient = useQueryClient();
  const { mutate: handleEdit, isPending: isEditing } = useMutation({
    mutationKey: ['editDocument'],
    mutationFn: editDocument,
    onSuccess: () => {
      setOpen(false);
      toast({
        title: 'Successfully edited document',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Failed to edit document',
        duration: 1500,
        description: 'Please try again later',
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
      <DialogContent className='flex flex-col gap-4 w-full'>
        <p className='text-xl font-semibold'>Upload Document</p>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Title</Label>
          <Input
            onChange={(e) => setTitle(e.target.value)}
            defaultValue={title}
          />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Document</Label>
          {documentUrl === '' ? (
            <UploadDropzone
              endpoint='documentUploader'
              config={{
                mode: 'auto',
              }}
              content={{
                uploadIcon({ isUploading }) {
                  if (isUploading) {
                    return <Loader2 className='h-12 w-12 animate-spin' />;
                  }
                  return <UploadIcon className='h-12 w-12' />;
                },
              }}
              appearance={{
                container:
                  ' border border-border border-dashed border-gray-300 rounded-lg p-4',
                button: 'hidden',
              }}
              onClientUploadComplete={(res) => {
                setDocumentUrl(res[0].url);
                setFileName(res[0].name);
                setFileSize(res[0].size);
              }}
            />
          ) : (
            <div className='flex items-center w-full'>
              <div className='flex flex-col'>
                <div className='absolute'>
                  <X
                    className='text-red-500 cursor-pointer'
                    onClick={() => {
                      setDocumentUrl('');
                      setFileName('');
                      setFileSize(0);
                    }}
                  />
                </div>
                <FcDocument className='h-24 w-24 ml-2' />
              </div>
              <div className='flex flex-col'>
                <p className='text-sm'>{fileName}</p>
                <p className='text-sm'>{fileSize}</p>
              </div>
            </div>
          )}
        </div>

        <div className='flex items-center gap-2 w-full'>
          <Button
            onClick={() => setOpen(false)}
            className='w-full'
            variant={'primary-outline'}
            disabled={isEditing}
          >
            Cancel
          </Button>
          <Button
            disabled={isEditing}
            onClick={() => {
              handleEdit({
                documentId: document.id,
                documentUrl,
                title: title ? title : fileName,
                fileSize,
              });
            }}
            className='w-full'
          >
            <ButtonLoading isLoading={isEditing} buttonText='Edit' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDocumentDialog;
