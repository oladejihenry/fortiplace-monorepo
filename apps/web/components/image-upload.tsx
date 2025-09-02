"use client"

import { Loader2, UploadCloud, X } from "lucide-react"
import Image from "next/image"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@workspace/ui/components/button"
import axios from "@/lib/axios"
import { toast } from "sonner"
import { AxiosError } from "axios"
interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  onRemove: () => void,
  endpoint: "cover-image"
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  endpoint
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [fileName, setFileName] = useState<string>("")

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0]
      if (!file) return

      setIsUploading(true)
      setFileName(file.name)

      const formData = new FormData()
      formData.append("file", file)
      const response = await axios.post(`/api/uploads/${endpoint}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if(response.data.url) {
        onChange(response.data.url)
      }
    } catch (error) {
      if(error instanceof AxiosError && error.response) {
        const {data} = error.response
        if(data.message) {
          toast.error("Failed to upload image", {
            description: data.message
          })
        } else {
          toast.error("Failed to upload image")
        }
      }
    } finally {
      setIsUploading(false)
    }

  }, [onChange, endpoint])

  const handleRemove = async () => {
    try {
      setIsRemoving(true)
      const response = await axios.delete(`/api/uploads/${endpoint}`, {
        data: {
          path: value
        }
      })
      if(response.status === 200) {
        onRemove()
        setFileName("")
      } 
    } catch (error) {
      if(error instanceof AxiosError && error.response) {
        const {data} = error.response
        if(data.message) {
          toast.error("Failed to remove image", {
            description: data.message
          })
        }
      }
    } finally {
      setIsRemoving(false)
    }
  }
  

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  })

  return (
    <div className="w-full flex flex-col gap-2">
      <div
        {...getRootProps()}
        className="
          border-2 
          border-dashed 
          rounded-lg 
          p-4 
          hover:bg-muted 
          transition
          cursor-pointer
          flex-1
        "
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Uploading {fileName}...</p>
          </div>
        ) : value ? (
          <div className="relative aspect-video">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-lg"
              src={value}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
            <div className="text-sm text-muted-foreground text-center">
              {isDragActive ? (
                <p>Drop the image here</p>
              ) : (
                <p>Drag & drop an image here, or click to select</p>
              )}
            </div>
          </div>
        )}
      </div>
      {value && (
        <div className="flex items-center">
          <Button
            onClick={handleRemove}
            variant="destructive"
            size="sm"
            disabled={isRemoving}
          >
            {isRemoving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            Remove Image
          </Button>
        </div>
      )}
    </div>
  )
}