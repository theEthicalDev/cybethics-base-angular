export class MediaFileItem {
  id: string;
  content: Blob | null;
  contentBlobUrl: string | null;
  storage: string;
  filename_download: string;
  title: string;
  type: string;
  folder: string;
  created_on: Date;
  modified_on: Date;
  filesize: number;
  width: number;
  height: number;
  uploaded_on: Date;
}

export function getBlobUrl(mediaFileItem: MediaFileItem | null): string | null {
  if (mediaFileItem?.contentBlobUrl) return mediaFileItem.contentBlobUrl;
  if (mediaFileItem?.content) {
    mediaFileItem.contentBlobUrl = URL.createObjectURL(mediaFileItem.content);
    return mediaFileItem.contentBlobUrl;
  }
  return null;
}
