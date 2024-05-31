'use server';

import { utapi } from '@/server/uploadthing';

export const deleteMedia = async (mediaUrl: string) => {
  await utapi.deleteFiles(mediaUrl);

  return;
};
