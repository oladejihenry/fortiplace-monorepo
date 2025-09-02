import { FileMetadata } from "./file-metadata";

export interface CourseFile {
  id?: string; // Course file ID from database (for existing files)
  title: string;
  file_url: string;
  file_hash?: string;
  metadata: FileMetadata;
  order: number; // Module order for sequencing
  module?: {
    title?: string;
    description?: string;
    order?: number;
  }
}

export interface CourseFileMetadata {
  name: string;
  size: number;
  type: string;
  module?: {
    title?: string;
    description?: string;
    order?: number;
  }
}
