import { BsTwitterX } from "react-icons/bs"
import { FaFacebook } from "react-icons/fa"
import Image from "next/image"
import Link from "next/link"

export function SiteFooter({ twitterUsername, facebookUsername, storeName }: { twitterUsername: string, facebookUsername: string, storeName: string }) {
  return (
    <footer className="border-t">
      <div className="container mx-auto max-w-7xl flex-grow px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground capitalize">
            © {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-2">
            {twitterUsername && (
              <Link
                href={`https://x.com/${twitterUsername}`}
                target="_blank"
                className="text-sm text-muted-foreground"
                aria-label="Twitter"
              >
                <BsTwitterX className="w-4 h-4 hover:text-primary" />
              </Link>
            )}
            {facebookUsername && (
              <Link
                href={`https://facebook.com/${facebookUsername}`}
                target="_blank"
                className="text-sm text-muted-foreground"
                aria-label="Facebook"
              >
                <FaFacebook className="w-4 h-4 hover:text-primary" />
              </Link>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground ">
            <Link href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}`} target="_blank" className="flex items-center gap-2">
              <span>Powered by</span>
              <Image 
                src="/fortiplace_transparent.png" 
                alt="Fortiplace" 
                width={80} 
                height={20} 
                className="object-contain mt-2"
                priority
              />
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}