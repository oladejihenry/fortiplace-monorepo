import { Button } from "@workspace/ui/components/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  // DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@workspace/ui/components/dropdown-menu";
import { SidebarAvatar } from "./sidebar-avatar";
import { User } from "@/types/user";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/auth/logOut";
// import Link from "next/link";
interface UserAvatarDropdownProps {
    user: User | null | undefined;
}

export function UserAvatarDropdown({ user }: UserAvatarDropdownProps) {

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 rounded-full p-0 flex items-center gap-2 hover:bg-transparent focus:bg-transparent active:bg-transparent"
        >
          <SidebarAvatar
            username={user.data?.username} 
            googleAvatar={user.data?.google_avatar} 
            twitterAvatar={user.data?.twitter_avatar} 
          />
          <div className="flex flex-col items-start">
            <p className="text-sm font-medium leading-none capitalize">{user.data?.username}</p>
            <p className="text-xs leading-none text-muted-foreground mt-1">
              {user.data?.email}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/* <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/account" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

