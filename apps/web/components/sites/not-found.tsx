"use client"
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export default function NotFoundComponent() {
  return (
    <div className="text-center space-y-8 max-w-[600px]">
        {/* Custom SVG Illustration */}
        <div className="w-full max-w-[400px] mx-auto">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-full h-auto text-muted-foreground/20"
          >
            {/* Circle for face */}
            <circle cx="12" cy="12" r="10" />
            {/* Sad mouth */}
            <path
              d="M8.5 15.2C9 14.4 10.4 13 12 13c1.6 0 3 1.4 3.5 2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="rotate(180 12 14)"
            />
            {/* Eyes */}
            <line x1="9" y1="9" x2="9.01" y2="9" strokeLinecap="round" />
            <line x1="15" y1="9" x2="15.01" y2="9" strokeLinecap="round" />
          </svg>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Page not found
          </h1>
          <p className="text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. Please check the URL 
            or navigate back to the homepage.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="default"
            className="w-full sm:w-auto"
            asChild
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Additional Help Text */}
        <p className="text-sm text-muted-foreground pt-4">
          If you believe this is a mistake, please contact support.
        </p>
      </div>
  )
}