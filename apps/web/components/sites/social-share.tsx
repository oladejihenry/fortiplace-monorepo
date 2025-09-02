import { Share2, Twitter, Facebook, Linkedin } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Button } from "@workspace/ui/components/button"

interface SocialShareProps {
    product: {
        name: string
    }
}

export const SocialShare = ({ product }: SocialShareProps) => {
    const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
        const url = window.location.href // We'll get the current URL directly
        const text = `Check out ${product.name}`
        
        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        }

        window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }

    return (
        <div className="flex gap-2 border-t pt-4 justify-start">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem 
                        onClick={() => handleShare('twitter')}
                        className="cursor-pointer"
                    >
                        <Twitter className="h-4 w-4 mr-2" />
                        Share on Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => handleShare('facebook')}
                        className="cursor-pointer"
                    >
                        <Facebook className="h-4 w-4 mr-2" />
                        Share on Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => handleShare('linkedin')}
                        className="cursor-pointer"
                    >
                        <Linkedin className="h-4 w-4 mr-2" />
                        Share on LinkedIn
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}