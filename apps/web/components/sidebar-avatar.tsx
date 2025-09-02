import { getUserInitials } from "@/lib/utils";
import * as Avatar from "@radix-ui/react-avatar";
import { cn } from "@workspace/ui/lib/utils";
interface SidebarAvatarProps {
    username?: string;
    googleAvatar?: string | null;
    twitterAvatar?: string | null;
    className?: string;
}

export function SidebarAvatar({username, googleAvatar, twitterAvatar, className}: SidebarAvatarProps){
    const imageUrl = googleAvatar || twitterAvatar || "";
  return (
    <Avatar.Root className={cn("inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted select-none", className)}>
        {imageUrl ? (
            <Avatar.Image 
                src={imageUrl} 
                alt={username || ""} 
                className="w-full h-full rounded-full object-cover" />
        ) : (
            <Avatar.Fallback 
                className="w-full h-full flex items-center justify-center text-base font-semibold text-primary bg-muted rounded-full"
                delayMs={200}
            >
                {getUserInitials(username)}
            </Avatar.Fallback>
        )}
    </Avatar.Root>
  )
}