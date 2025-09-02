import NotFound from "@/app/not-found";
import { ProductActionButton } from "@/components/downloads/product-action-button";
import { VerifyEmailForm } from "@/components/downloads/verify-email-form";
import axios from "@/lib/axios";
import { ProductType } from "@/types/product";
import { AxiosError } from "axios";
import { CheckCircle, FileText, Info } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Downloads",
  description: "Download your purchased products",
}

interface Product{
  id: string;
  name: string;
  description: string;
  product_type: ProductType;
  download_url: string;
  file_name: string;
  view_product_online: boolean;
}

interface Order{
  id: string;
  customer_email: string;
  created_at: string;
  total_amount: number;
  currency: string;
}

interface VerifiedData{
  order: Order;
  products: Product[];
}

async function verifyToken(token: string): Promise<VerifiedData | null>{
  try {
    const response = await axios.get(`/api/downloads/verify?token=${token}`)
    return response.data
  } catch (error) {
    if(error instanceof AxiosError) {
      return null
    }
    throw error
  }
}

// Helper function to format product type
function formatProductType(type: ProductType): string {
  switch (type) {
    case ProductType.DIGITAL:
      return "Digital Product";
    case ProductType.EBOOK:
      return "eBook";
    case ProductType.PHYSICAL:
      return "Physical Product";
    case ProductType.COURSE:
      return "Course";
    default:
      return "Product";
  }
}

export default async function DownloadPage({searchParams, params}: 
  {searchParams: Promise<{token: string}>;
    params: Promise<{orderid: string}>}) {
    const {token} = await searchParams;
    const {orderid} = await params;


    if(!token) {
      return <NotFound />
    }

    const verifiedData = await verifyToken(token)

    if(!verifiedData) {
      return <VerifyEmailForm orderId={orderid} />
    }

    const {order, products} = verifiedData
    
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Your Downloads</h1>
          
          <div className="mb-6">
            <p className="text-muted-foreground mb-1">Order ID: {order.id}</p>
            <p className="text-sm text-muted-foreground">
              These download links are valid for 30 days. If a link expires, simply return to this page to generate new download links.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="border border-border rounded-lg p-4 bg-card hover:bg-accent/5 transition duration-150"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold capitalize">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{formatProductType(product.product_type)}</p>
                  </div>
                  {/* <a
                    href={product.download_url}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-md transition duration-150 text-center sm:whitespace-nowrap"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a> */}
                  <ProductActionButton
                    downloadUrl={product.download_url}
                    fileName={product.file_name}
                    viewOnline={product.view_product_online}
                    token={token}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm text-muted-foreground border-t border-border pt-4">
            <p className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>You have lifetime access to these files</span>
            </p>
            <p className="flex items-center">
              <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Download links are refreshed every time you visit this page</span>
            </p>
            <p className="flex items-center">
              <Info className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>For any issues, please contact support at support@fortiplace.com</span>
            </p>
          </div>
        </div>
      </div>
    )
}