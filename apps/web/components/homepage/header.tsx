'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@workspace/ui/components/navigation-menu";
import { Button } from "@workspace/ui/components/button";

export default function HomeHeader() {
  const router = useRouter();


  return (
    <header className="fixed top-0 w-full bg-background/90 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            <Image 
              src="/fortiplace_transparent.png" 
              alt="Fortiplace" 
              width={80} 
              height={80} 
              className="object-contain mt-2 w-auto h-auto"
            />
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex gap-6">
              <NavigationMenuItem>
                <Link href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
              Log In
            </Link>
            <Button 
              variant="default" 
              onClick={() => router.push("/register")} 
              className="bg-primary text-white hover:bg-primary/90"
            >
              Start Selling
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}