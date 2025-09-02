"use client"

import { UploadCloud, File, Loader2, Trash } from "lucide-react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import axios from "@/lib/axios"
import { AxiosError } from "axios"
import { toast } from "sonner"

interface FileUploadProps {
  value?: string
  initialFileMetadata?: {
    name: string;
    size: number;
    type: string;
    file_hash?: string;
  } | null
  onChange: (value: string, metadata?: {
    file_hash?: string,
    name?: string,
    size?: number,
    type?: string
  }) => void
  onRemove: () => void
  endpoint: "product-file" | "cover-image"
  maxSize?: number
  className?: string
}

const acceptedFileTypes = {
  'product-file': {
    'application/pdf': ['.pdf'],
    'application/zip': ['.zip'],
    'image/*': ['.png', '.jpg', '.jpeg'],
    'application/x-rar-compressed': ['.rar'],
  },
  'cover-image': {
    'image/*': ['.png', '.jpg', '.jpeg', '.webp']
  }
} as const

export function FileUpload({
  value,
  initialFileMetadata,
  onChange,
  onRemove,
  endpoint,
  maxSize = endpoint === 'cover-image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024,
  className,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [fileMetadata, setFileMetadata] = useState<{
    name: string;
    size: number;
    type: string;
    file_hash?: string;
  } | null>(initialFileMetadata || null)

  // Format file size to human readable format
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0]
      if (!file) return

      setIsUploading(true)
      setFileMetadata({
        name: file.name,
        size: file.size,
        type: file.type
      })

      const formData = new FormData()
      formData.append('file', file)
      const response = await axios.post(`/api/uploads/${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      if(response.data.url) {
        onChange(response.data.url, {
          file_hash: response.data.file_hash,
          name: file.name,
          size: file.size,
          type: file.type
        })
      }
    } catch (error) {
      if(error instanceof AxiosError) {
        toast.error(`Upload failed: ${error.response?.data.message}`)
      } else {
        toast.error(`Upload failed: ${error}`)
      }
    } finally {
      setIsUploading(false)
    }
  }, [onChange, endpoint])

  const handleRemove = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.stopPropagation()
      if(!value) return
      setIsRemoving(true)
      const response = await axios.delete(`/api/uploads/${endpoint}`, {
        data: {
          path: value,
          file_hash: fileMetadata?.file_hash || initialFileMetadata?.file_hash
        }
      })
      if(response.status === 200) {
        onRemove()
        setFileMetadata(null)
      }
    } catch (error) {
      if(error instanceof AxiosError) {
        toast.error(`Remove failed: ${error.response?.data.message}`)
      } else {
        toast.error(`Remove failed: ${error}`)
      }
    } finally { 
      setIsRemoving(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes[endpoint],
    maxSize,
    multiple: false,
  })

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          isDragActive ? "border-primary/50 bg-primary/5" : "border-muted-foreground/25",
          value && "border-primary/50 bg-primary/5"
        )}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Uploading {fileMetadata?.name}...
            </p>
          </div>
        ) : value && (fileMetadata || initialFileMetadata) ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <File className="h-8 w-8 text-primary" />
              <div className="min-w-0 max-w-[200px]">
                <p className="text-sm font-medium truncate">{fileMetadata?.name || initialFileMetadata?.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatFileSize(fileMetadata?.size || initialFileMetadata?.size || 0)}</span>
                  <span>•</span>
                  <span>{fileMetadata?.type || initialFileMetadata?.type}</span>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash className="h-4 w-4" />
              )}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Drag & drop your file here, or{" "}
                <span className="text-primary font-medium">browse</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {endpoint === 'cover-image' 
                  ? 'Supported formats: PNG, JPG, JPEG, WebP (up to 10MB)'
                  : 'Supported formats: PDF, ZIP, RAR (up to 100MB)'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}