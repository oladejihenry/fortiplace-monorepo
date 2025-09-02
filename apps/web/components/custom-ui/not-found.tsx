'use client'
import { Button } from "@workspace/ui/components/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-4">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-xl font-semibold">Product Not Found</h2>
      <p className="text-muted-foreground">
        The product you&apos;re looking for doesn&apos;t exist or has been removed
      </p>
      <Button
        variant="outline"
        onClick={() => window.location.href = '/products'}
      >
        Return to Products
      </Button>
    </div>
  );
}