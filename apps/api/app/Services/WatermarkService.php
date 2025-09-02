<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use setasign\Fpdi\Tcpdf\Fpdi;

class WatermarkService
{
    public function watermarkPdf(string $filePath, string $watermarkText): string
    {
        $pdf = new Fpdi();
        $pageCount = $pdf->setSourceFile(Storage::path($filePath));

        for ($i = 1; $i <= $pageCount; $i++) {
            $tplId = $pdf->importPage($i);
            $pdf->AddPage();
            $pdf->useTemplate($tplId, 0, 0, null, null, true);

            $pdf->SetFont('helvetica', '', 12);
            $pdf->SetTextColor(200, 200, 200); // Light gray
            $pdf->SetAlpha(0.3); // Transparency

            // Add diagonal watermark
            $pdf->Rotate(45, 100, 100);
            $pdf->Text(10, 100, $watermarkText);
            $pdf->Rotate(0);
        }

        // Save to a new file
        $watermarkedPath = 'watermarked_' . basename($filePath);
        $pdf->Output(Storage::path($watermarkedPath), 'F');

        return $watermarkedPath;
    }

    public function watermarkImage(string $filePath, string $watermarkText): string
    {
        $image = \Intervention\Image\Facades\Image::make(Storage::path($filePath));

        $image->text($watermarkText, $image->width() / 2, $image->height() / 2, function ($font) {
            $font->file(public_path('fonts/OpenSans-Regular.ttf'));
            $font->size(24);
            $font->color([255, 255, 255, 0.3]);
            $font->align('center');
            $font->valign('middle');
            $font->angle(45);
        });

        $watermarkedPath = 'watermarked_' . basename($filePath);
        $image->save(Storage::path($watermarkedPath));

        return $watermarkedPath;
    }
}
