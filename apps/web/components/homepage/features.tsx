import { Zap } from "lucide-react";

import { Shield } from "lucide-react";

import { Globe2 } from "lucide-react";

export default function HomeFeatures() {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Everything you need to succeed</h2>
            <p className="mt-4 text-muted-foreground">Powerful features to help you sell more and grow faster</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border bg-gradient-to-br from-primary/10 to-transparent">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Instant Payouts</h3>
              <p className="text-muted-foreground">
                Get paid on your schedule—daily, weekly, or monthly—with no waiting periods.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-gradient-to-br from-primary/10 to-transparent">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-muted-foreground">Bank-level security for all your transactions and customer data</p>
            </div>
            <div className="p-6 rounded-xl border bg-gradient-to-br from-primary/10 to-transparent">
              <Globe2 className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
              <p className="text-muted-foreground">Sell to customers worldwide with multi-currency support</p>
            </div>
          </div>
        </div>
      </section>
  );
}