export interface FileMetadata {
  name: string
  size: number
  type: string
  url?: string
  version?: number
  file_hash?: string
  module?: {
    title?: string;
    description?: string;
    order?: number;
  }
}