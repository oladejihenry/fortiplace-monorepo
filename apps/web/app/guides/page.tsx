import { Metadata } from "next"
import { ArrowRight, FileText, CreditCard, ShoppingCart, Settings, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Platform Guide - FortiPlace",
  description: "Learn how to use FortiPlace to sell your digital products and grow your business.",
}

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background mt-16">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">How to Use FortiPlace</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Follow this guide to start selling your digital products and building your creator business.
          </p>

          {/* Steps */}
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">1. Create Your Account</h2>
                <p className="text-muted-foreground mb-4">
                  Sign up for a FortiPlace account and verify your email address. Make sure to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Choose a professional username</li>
                  <li>Add a profile picture and bio</li>
                  <li>Set up your payment information</li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">2. Create Your Products</h2>
                <p className="text-muted-foreground mb-4">
                  Add your digital products to your store:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Upload your digital files</li>
                  <li>Write compelling product descriptions</li>
                  <li>Set competitive prices</li>
                  <li>Add attractive product images</li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">3. Customize Your Store</h2>
                <p className="text-muted-foreground mb-4">
                  Make your store stand out:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Customize your store layout</li>
                  <li>Add your brand colors and logo</li>
                  <li>Create product categories</li>
                  <li>Set up your store policies</li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">4. Start Selling</h2>
                <p className="text-muted-foreground mb-4">
                  Promote your products and manage sales:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Share your store link</li>
                  <li>Monitor your analytics</li>
                  <li>Respond to customer inquiries</li>
                  <li>Process orders promptly</li>
                </ul>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">5. Get Paid</h2>
                <p className="text-muted-foreground mb-4">
                  Manage your earnings:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Set up your payout method</li>
                  <li>Track your earnings</li>
                  <li>View transaction history</li>
                  <li>Manage tax information</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-4">Ready to Start?</h2>
            <p className="text-muted-foreground">
              Create your account now and join thousands of creators selling their digital products on FortiPlace.
            </p>
            <div className="mt-8">
              <a 
                href="/register" 
                className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}