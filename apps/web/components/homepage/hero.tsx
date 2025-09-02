"use client"

import { Sparkles } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";

export default function HomeHero() {
  const router = useRouter()

  const handleWatchDemo = () => {
    // Open in new tab
    window.open("https://www.youtube.com/shorts/-TASfYs4-TU?feature=share", "_blank")
  }

  return (
    <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="container mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-background/90 backdrop-blur-sm px-4 py-1 rounded-full border mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Launch your digital store in minutes</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
            Transform your digital content into a<span className="text-primary"> thriving business</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            The all-in-one platform that makes selling digital products seamless. From courses to ebooks, reach
            customers worldwide with zero technical hassle.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push("/register")} size="lg" className="bg-primary text-white hover:bg-primary/90">
              Start Selling Now
            </Button>
            <Button onClick={handleWatchDemo} size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">1K+</div>
              <div className="text-sm text-muted-foreground">Active Sellers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">100K+</div>
              <div className="text-sm text-muted-foreground">Products Sold</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">10+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>
  );
}