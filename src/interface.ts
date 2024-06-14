export interface FileMetadata {
    id: string;
    originalName: string;
    data: Buffer;
    mimeType: string;
    size: number;
    path: string;
    uploadDate: Date;
  }