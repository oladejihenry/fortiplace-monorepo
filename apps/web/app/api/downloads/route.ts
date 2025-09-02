// app/api/downloads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/axios';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const fileUrl = url.searchParams.get('fileUrl');
    const fileName = url.searchParams.get('fileName');

    if (!fileUrl || !fileName) {
      return new NextResponse('Missing file parameters', { status: 400 });
    }

    // Fetch the file from your storage
    const response = await axios.get(fileUrl, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'application/pdf,application/zip,image/jpeg,image/png'
      }
    });

    // Get the file extension from the filename
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
    
    // Map file extensions to content types
    const contentTypeMap: Record<string, string> = {
      'pdf': 'application/pdf',
      'zip': 'application/zip',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png'
    };

    // Get content type based on file extension or fallback to binary
    const contentType = contentTypeMap[fileExtension] || 'application/octet-stream';

    // Set appropriate headers for download
    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
    headers.set('Content-Type', contentType);
    headers.set('Content-Length', response.data.length.toString());

    return new NextResponse(response.data, {
      headers,
    });
  } catch (error) {
    console.error('Download error:', error);
    return new NextResponse('Download failed', { status: 500 });
  }
}