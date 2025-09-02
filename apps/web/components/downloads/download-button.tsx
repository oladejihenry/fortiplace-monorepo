// components/downloads/download-button.tsx
'use client';

import { Button } from "@workspace/ui/components/button";
import { AxiosError } from "axios";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface DownloadButtonProps {
  downloadUrl: string;
  fileName: string;
}

export function DownloadButton({ downloadUrl, fileName }: DownloadButtonProps) {
  const handleDownload = async () => {
    try {
      // Create the download URL with the API route
      const apiDownloadUrl = `/api/downloads?fileUrl=${encodeURIComponent(downloadUrl)}&fileName=${encodeURIComponent(fileName)}`;
      
      // Create a hidden anchor element
      const link = document.createElement('a');
      link.href = apiDownloadUrl;
      link.setAttribute('download', fileName);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      
      toast.success('Download started');
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error('Download failed');
      }
    }
  };

  return (
    <Button
      onClick={handleDownload}
      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition duration-150"
    >
      <Download className="mr-2 h-4 w-4" />
      Download
    </Button>
  );
}