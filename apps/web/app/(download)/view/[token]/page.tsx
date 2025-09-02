// app/(download)/view/[token]/page.tsx
import NotFound from "@/app/not-found";
import { PDFViewer } from "@/components/downloads/pdf-viewer";
import axios from "@/lib/axios";
import { ProductType } from "@/types/product";
import { AxiosError } from "axios";

export const generateMetadata = async ({
  params,
  searchParams
}: {
  params: Promise<{ token: string }>,
  searchParams: Promise<{ file: string }>
}) => {
  const {token} = await params;
  const {file} = await searchParams;

  const verifiedData = await verifyToken(token);

  if (!verifiedData || !file) {
    return {
      title: "Document Not Found",
      description: "The requested document was not found or is not accessible.",
    };
  }

  const product = verifiedData.products.find(p => p.file_name === file);

  if (!product || !product.view_product_online) {
    return {
      title: "Document Not Found",
      description: "The requested document was not found or is not accessible.",
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
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

export default async function ViewerPage({
  params,
  searchParams
}: {
  params: Promise<{ token: string }>,
  searchParams: Promise<{ file: string }>
}) {
  const {token} = await params;
  const {file} = await searchParams;

  const verifiedData = await verifyToken(token);

  if (!verifiedData || !file) {
    return <NotFound />;
  }

  const product = verifiedData.products.find(p => p.file_name === file);

  if (!product || !product.view_product_online) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background py-4 sm:py-6 lg:py-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 line-clamp-2">{product.name}</h1>
          <PDFViewer 
            fileUrl={`/api/downloads?fileUrl=${encodeURIComponent(product.download_url)}&fileName=${encodeURIComponent(product.file_name)}&view=true&token=${token}`}
          />
        </div>
      </div>
    </div>
  );
}