// components/downloads/product-action-button.tsx
'use client';

import { Button } from "@workspace/ui/components/button";
import { AxiosError } from "axios";
import { Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProductActionButtonProps {
  downloadUrl: string;
  fileName: string;
  viewOnline: boolean;
  token: string;
}

export function ProductActionButton({ downloadUrl, fileName, viewOnline, token }: ProductActionButtonProps) {
  const router = useRouter();

  const handleAction = async () => {
    try {
      if (viewOnline) {
        // Navigate to the viewer page
        router.push(`/view/${token}?file=${encodeURIComponent(fileName)}`);
        return;
      }

      // Download functionality
      const apiDownloadUrl = `/api/downloads?fileUrl=${encodeURIComponent(downloadUrl)}&fileName=${encodeURIComponent(fileName)}`;
      
      const link = document.createElement('a');
      link.href = apiDownloadUrl;
      link.setAttribute('download', fileName);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started');
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error(viewOnline ? 'Failed to open document' : 'Download failed');
      }
    }
  };

  return (
    <Button
      onClick={handleAction}
      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition duration-150"
    >
      {viewOnline ? (
        <>
          <Eye className="mr-2 h-4 w-4" />
          View Online
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download
        </>
      )}
    </Button>
  );
}