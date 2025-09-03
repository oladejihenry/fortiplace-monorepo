import Link from 'next/link'
import Image from 'next/image'
import { Toaster } from 'sonner'

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark:bg-background flex min-h-screen flex-col">
      <Toaster />
      {/* Simple navbar */}
      <header className="border-b">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/fortiplace_transparent.png"
              alt="Fortiplace"
              width={400}
              height={400}
              className="h-12 w-auto"
              priority
            />
          </Link>
          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition"
            >
              Home
            </Link>
            <Link
              href="/contact-us"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="bg-primary hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium text-white transition"
            >
              Sign In
            </Link>
          </nav>
          <div className="md:hidden">
            <Link
              href="/login"
              className="bg-primary hover:bg-primary/90 rounded-md px-3 py-1.5 text-sm font-medium text-white transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto max-w-7xl flex-grow px-4">{children}</main>

      {/* Simple footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 md:mb-0">
              <p className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} Fortiplace. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link
                href="/terms-of-service"
                className="text-muted-foreground hover:text-foreground text-xs transition"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy-policy"
                className="text-muted-foreground hover:text-foreground text-xs transition"
              >
                Privacy Policy
              </Link>
              <Link
                href="/support"
                className="text-muted-foreground hover:text-foreground text-xs transition"
              >
                Help & Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
