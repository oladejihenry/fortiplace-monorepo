import Link from "next/link";

export default function HomeFooter() {
  return (
   <footer className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <Link href="/" className="text-2xl font-bold text-[#34D399] mb-4 block">
                FortiPlace
              </Link>
              <p className="text-gray-400 mb-4">
                The ultimate platform for creators to sell digital products and build sustainable businesses.
              </p>
              <div className="flex gap-4">
                <Link href="https://x.com/fortiplace" target="_blank" className="text-gray-400 hover:text-[#34D399]">
                  X
                </Link>
                <Link href="https://www.linkedin.com/company/fortiplace" target="_blank" className="text-gray-400 hover:text-[#34D399]">
                  LinkedIn
                </Link>
                <Link href="https://www.instagram.com/fortiplace" target="_blank" className="text-gray-400 hover:text-[#34D399]">
                  Instagram
                </Link>
              </div>
            </div>
            <div>
              {/* <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-3">
                <Link href="#" className="block text-gray-400 hover:text-[#34D399]">
                  Features
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-[#34D399]">
                  Pricing
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-[#34D399]">
                  Marketplace
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-[#34D399]">
                  Integrations
                </Link>
              </div> */}
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <div className="space-y-3">
                <Link href="/guides" className="block text-gray-400 hover:text-[#34D399]">
                  Guides
                </Link>
                <Link href="/help" className="block text-gray-400 hover:text-[#34D399]">
                  Help Center
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-3">
                <Link href="#" className="block text-gray-400 hover:text-[#34D399]">
                  About
                </Link>
                <Link href="/contact-us" className="block text-gray-400 hover:text-[#34D399]">
                  Contact
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400">© 2025 FortiPlace. All rights reserved.</p>
              <div className="flex gap-8">
                <Link href="/privacy-policy" className="text-gray-400 hover:text-[#34D399]">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-[#34D399]">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
  );
}