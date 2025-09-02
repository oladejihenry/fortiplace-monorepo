'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@workspace/ui/components/button'
import { CheckCircle, Download, Loader2, XCircle } from 'lucide-react'

import { toast } from 'sonner'
import { storage } from '@/lib/utils'
import { useCartStore } from '@/store/use-cart-store'
import axios from '@/lib/axios'

interface DownloadItem {
  download_url: string
  product_name: string
  expires_in: string
}

interface VerificationResponse {
  status: string
  message: string
  order_id: string
  downloads: DownloadItem[]
}

export default function PaymentSuccessPage() {
  const [isVerifying, setIsVerifying] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'cancelled' | 'failed'>()
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const { clearCart } = useCartStore()
  const searchParams = useSearchParams()
  const router = useRouter()

  const reference = searchParams.get('reference')
  const txRef = searchParams.get('tx_ref')
  const transactionId = searchParams.get('transaction_id')
  const status = searchParams.get('status')

  const storedReference = storage.get('reference')

  const paymentReference = reference || txRef || storedReference

  useEffect(() => {
    async function verifyPayment() {
      try {
        if (!paymentReference) {
          toast.error('Payment reference not found')
          setPaymentStatus('failed')
          return
        }

        if (status === 'cancelled') {
          setPaymentStatus('cancelled')
          toast.error('Payment was cancelled')
          return
        }

        const response = await axios.get<VerificationResponse>(
          `/api/orders/verify/${paymentReference}`,
        )

        if (response.data.status === 'success') {
          clearCart()
          setDownloads(response.data.downloads || [])
          toast.success('Payment successful! You can now access your products.')
          setPaymentStatus('success')
          // Clear the stored reference
          localStorage.removeItem('reference')
          localStorage.removeItem('checkout_idempotency_key')
        } else if (response.data.status === 'cancelled') {
          setPaymentStatus('cancelled')
          toast.error('Payment was cancelled')
        } else {
          setPaymentStatus('failed')
          toast.error(response.data.message || 'Payment verification failed')
        }
      } catch (error) {
        console.error('Payment verification failed:', error)
        toast.error('Payment verification failed. Please contact support.')
        setPaymentStatus('failed')
      } finally {
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [reference, clearCart, status, transactionId, paymentReference])

  const handleDownload = async (downloadUrl: string) => {
    try {
      // const cleanUrl = downloadUrl.replace(/storage\/storage\//, 'storage/');
      // const response = await axios.get(cleanUrl, {
      //     responseType: 'blob',
      //     headers: {
      //         'Content-Type': 'application/octet-stream'
      //     }
      // })

      // const url = window.URL.createObjectURL(new Blob([response.data], {
      //     type: 'application/zip' // or the appropriate mime type
      // }))
      // const link = document.createElement('a')
      // link.href = url
      // link.setAttribute('download', `${productName}.zip`)
      // document.body.appendChild(link)
      // link.click()

      // // Cleanup
      // setTimeout(() => {
      //     document.body.removeChild(link)
      //     window.URL.revokeObjectURL(url)
      // }, 100)
      window.open(downloadUrl, '_blank')
      toast.success('Downloading started...')
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Failed to download file. Please try again.')
    }
  }

  if (isVerifying) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#00A99D]" />
          <p className="text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'cancelled') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-8">
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
          </div>
          <h1 className="mb-4 text-2xl font-bold">Payment Cancelled</h1>
          <p className="text-muted-foreground mb-8">
            Your payment was cancelled. No charges were made.
          </p>
          <Button onClick={() => router.push('/')} className="w-full">
            Return to Shopping
          </Button>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-8">
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
          </div>
          <h1 className="mb-4 text-2xl font-bold">Payment Failed</h1>
          <p className="text-muted-foreground mb-8">
            We couldn&apos;t process your payment. Please try again or contact support.
          </p>
          <Button onClick={() => router.push('/')} className="w-full">
            Return to Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8">
          <CheckCircle className="mx-auto h-16 w-16 text-[#00A99D]" />
        </div>
        <h1 className="mb-4 text-2xl font-bold">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. You will receive a confirmation email shortly.
        </p>
        <div className="space-y-4">
          {downloads?.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Your Downloads</h2>
              {downloads.map((item, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <p className="mb-2 font-medium">{item.product_name}</p>
                  {/* <p className="text-sm text-muted-foreground mb-3">
                    Expires in: {item.expires_in}
                  </p> */}
                  <Button
                    onClick={() => handleDownload(item.download_url)}
                    className="w-full bg-[#00A99D] text-white hover:bg-[#00A99D]/90"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
          <Button className="w-full bg-[#00A99D] text-white hover:bg-[#00A99D]/90">
            Check your email for your downloads
          </Button>
          <Button variant="outline" onClick={() => router.push('/')} className="w-full">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}
