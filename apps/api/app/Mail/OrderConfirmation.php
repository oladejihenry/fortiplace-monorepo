<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Order;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Log;
use App\Helpers\UrlHelper;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Mail\Mailables\Attachment;

class OrderConfirmation extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $timeout = 120;

    public $downloadUrl;
    public $items;
    protected $pdfPath;
    protected $sellerEmail;
    protected $sellerStore;
    public $storeUrl;
    public $storeName;
    /**
     * Create a new message instance.
     */
    public function __construct(public Order $order)
    {
        $this->order = $order->load(['items.product', 'items.product.user']);
        $this->items = $this->order->items;

        //Get the seller details from the first item
        $firstItem = $this->order->items[0];
        $this->sellerStore = $firstItem->product->user->store;
        $this->sellerEmail = $firstItem->product->user->email;

        //since we use s3 i think expires_at should be 30 days
        $expiresAt = now()->addDays(30)->timestamp;

        //for now can we do 3 minutes
        // $expiresAt = now()->addMinutes(3)->timestamp;

        //create a signed token
        $token = encrypt([
            'order_id' => $this->order->id,
            'email' => $this->order->customer_email,
            'expires_at' => $expiresAt
        ]);

        $frontendUrl = env('FRONTEND_URL');

        // Use the UrlHelper to build the download URL
        $downloadPath = "{$frontendUrl}/downloads/{$this->order->order_id}?token={$token}";
        $this->downloadUrl = $downloadPath;

        //get store url
        $storeSubdomain = $this->order->items[0]->product->user->store->subdomain;
        $storeUrl = $storeSubdomain . '.' . $frontendUrl;

        //store url
        $this->storeUrl = $storeUrl;
        $this->storeName = $this->order->items[0]->product->user->store->name ??
            $this->order->items[0]->product->user->store->subdomain;

        //permanent download url
        // $this->downloadUrl = URL::signedRoute(
        //     'orders.email-download-url',
        //     ['order_id' => $this->order->order_id]
        // );

        // Generate PDF receipt
        $this->generatePdfReceipt();

        Log::info('Order confirmation email sent', [
            'order_id' => $this->order->order_id,
            'customer_email' => $this->order->customer_email,
            'download_url' => $this->downloadUrl
        ]);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        //order store name
        $storeName = $this->order->items[0]->product->user->store->name ??
            $this->order->items[0]->product->user->store->subdomain;
        return new Envelope(
            subject: 'You bought ' . ucfirst($this->order->items[0]->product->name) . ' - ' . 'From ' . ucfirst($storeName) . ' !',
            // subject: 'Your order from ' . $storeName . ' is ready',
            replyTo: [$this->sellerEmail]
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.orders.confirmation',
            with: [
                'order' => $this->order,
                'downloadUrl' => $this->downloadUrl,
                'customerEmail' => $this->order->customer_email,
                'items' => $this->order->items->load('product'),
                'customerName' => $this->order->metadata['customer_details']['firstName'] ?? 'Valued Customer',
                'sellerEmail' => $this->sellerEmail,
                'sellerStore' => $this->sellerStore,
                'storeUrl' => $this->storeUrl,
                'storeName' => $this->storeName,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $attachments = [];

        //add the pdf attachment
        if ($this->pdfPath && file_exists($this->pdfPath)) {
            $attachments[] = Attachment::fromPath($this->pdfPath)
                ->as('receipt_' . $this->order->order_id . '.pdf')
                ->withMime('application/pdf');
        }

        return $attachments;
    }


    protected function generatePdfReceipt()
    {
        try {
            // Generate the PDF
            $pdf = PDF::loadView('pdf.receipt', [
                'order' => $this->order,
            ]);

            // Create a unique filename
            $filename = 'receipt_' . $this->order->order_id . '.pdf';
            $tempPath = storage_path('app/temp');

            // Ensure the directory exists
            if (!file_exists($tempPath)) {
                mkdir($tempPath, 0755, true);
            }

            // Save the PDF to a temporary location
            $this->pdfPath = $tempPath . '/' . $filename;
            $pdf->save($this->pdfPath);

            Log::info('PDF receipt generated', [
                'order_id' => $this->order->order_id,
                'path' => $this->pdfPath
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to generate PDF receipt', [
                'order_id' => $this->order->order_id,
                'error' => $e->getMessage()
            ]);
        }
    }
}
