import HomeHeader from "@/components/homepage/header"
import HomeHero from "@/components/homepage/hero"
import HomeFeatures from "@/components/homepage/features"
import { Metadata } from "next"
import HomeFAQ from "@/components/homepage/faq"
import HomeFooter from "@/components/homepage/footer"

export const metadata: Metadata = {
  title: "Fortiplace",
  description: "The ultimate platform for creators to sell digital products and build sustainable businesses.",
  twitter: {
    card: "summary_large_image",
    title: "Fortiplace",
    description: "The ultimate platform for creators to sell digital products and build sustainable businesses.",
    creator: "@fortiplace",
    images: ["/fortiplace_twitter.png"],
  },
  openGraph: {
    title: "Fortiplace",
    description: "The ultimate platform for creators to sell digital products and build sustainable businesses.",
    url: "https://fortiplace.com",
    siteName: "Fortiplace",
    images: ["/fortiplace_fb.png"],
  },
}

export default function Home() {
  return (
    <div className="min-h-screen bg-primary/5">
      {/* Navigation */}
      <HomeHeader />

      {/* Hero Section */}
      <HomeHero />

      {/* Features Grid */}
      <HomeFeatures />

      {/* FAQ Section */}
      <HomeFAQ />

      {/* Footer */}
      <HomeFooter />
    </div>
  )
}
