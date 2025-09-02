"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, Ban, Trash, Check, User2, CreditCard } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { roles } from "@/types/roles"
import axios from "@/lib/axios"
import { AxiosError } from "axios"
import { parseAsString } from "nuqs"
import { useQueryState } from "nuqs"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Dialog } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Cookies from "js-cookie"
// Define the type for individual user based on API response
interface UserData {
  id: string;
  username: string;
  email: string;
  subdomain: string;
  store_url: string;
  role: string;
  permissions: string[];
  bank_code: string | null;
  bank_account_number: string | null;
  phone_number: string | null;
  description: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  is_banned?: boolean;
  disable_payouts?: boolean;
}

export function UsersTable() {
  const [users, setUsers] = useState<UserData[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search] = useQueryState('search', parseAsString.withDefault(''));
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToDisablePayouts, setUserToDisablePayouts] = useState<string | null>(null);
  //Add a state for ban modal
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [userToBan, setUserToBan] = useState<string | null>(null);
  const [banReason, setBanReason] = useState<string | null>(null);


  const fetchUsers = async (page: number, search: string) => {
    try {
      const response = await axios.get(`/api/admin/users`, {
        params: { page, search }
      });
      setUsers(response.data.data);
      setTotalPages(response.data.meta.last_page);
    } catch (error) {
      if(error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Failed to fetch users");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  useEffect(() => {
    fetchUsers(page, search);
  }, [page, search]);

  //sort users: admin first, then creator, then user
  const sortedUsers = [...users].sort((a, b) => {
    const aIsAdmin = a.role.includes('admin');
    const bIsAdmin = b.role.includes('admin');
    
    if(aIsAdmin && !bIsAdmin) return -1;
    if(!aIsAdmin && bIsAdmin) return 1;

    return a.username.localeCompare(b.username);
  });


  const handleRoleChange = async (userId: string, role: string) => {
    try {
      const response = await axios.put(`/api/admin/users/${userId}`, { role })
      toast.success(response.data.message || "User role updated successfully");
      await fetchUsers(page, search);
    } catch (error) {
      if(error instanceof AxiosError) {
        if(error.response?.status === 403) {
          toast.error(error.response.data.message || "You are not authorized to update this user's role");
        } else {
          toast.error(error.response?.data.message || "Failed to update user role");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const openBanModal = (userId: string) => {
    setBanModalOpen(true);
    setBanReason('');
    setUserToBan(userId);
  };

  const submitBan = async () => {
    if(!userToBan) return;

    try {
      const response = await axios.post(`/api/admin/users/${userToBan}/ban`, { 
        reason: banReason?.trim() || 'No reason provided'
      })
      toast.success(response.data?.message || "User banned successfully");
      setBanModalOpen(false);
      await fetchUsers(page, search);
    } catch (error) {
      if(error instanceof AxiosError) {
        if(error.response?.status === 403) {
          toast.error(error.response.data.message || "You are not authorized to ban this user");
        } else {
          toast.error(error.response?.data.message || "Failed to ban user");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }


  const handleUnban = async (userId: string) => {
    try {
      const response = await axios.post(`/api/admin/users/${userId}/unban`)
      toast.success(response.data?.message || "User unbanned successfully");
      await fetchUsers(page, search);
    } catch (error) {
      if(error instanceof AxiosError) {
        if(error.response?.status === 403) {
          toast.error(error.response.data?.message || "You are not authorized to unban this user");
        } else {
          toast.error(error.response?.data?.message || "Failed to unban user");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await axios.delete(`/api/admin/users/${userId}`)

      setUserToDelete(null);
      toast.success(response.data.message || "User deleted successfully");
      await fetchUsers(page, search);

    } catch (error) {
      if(error instanceof AxiosError ) {
        if(error.response?.status === 403) {
          toast.error(error.response.data.message || "You cannot delete your own account");
        } else {
          toast.error(error.response?.data.message || "Failed to delete user");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };


  const isBanned = (user: UserData): boolean => {
    return user.is_banned === true;
  };

  const isPayoutsDisabled = (user: UserData): boolean => {
    return user.disable_payouts === true;
  };

  const handleDisablePayouts = async (userId: string) => {
    try {
      const response = await axios.post(`/api/admin/users/${userId}/disable-payouts`)
      setUserToDisablePayouts(null);
      toast.success(response.data.message || "Payouts disabled successfully");
      await fetchUsers(page, search);
    } catch (error) {
      if(error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Failed to disable payouts");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  const handleEnablePayouts = async (userId: string) => {
    try {
      const response = await axios.post(`/api/admin/users/${userId}/enable-payouts`)
      setUserToDisablePayouts(null);
      toast.success(response.data.message || "Payouts enabled successfully");
      await fetchUsers(page, search);
    } catch (error) {
      if(error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Failed to enable payouts");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  const handleImpersonate = async (userId: string) => {
    try {
      const response = await axios.post(`/api/admin/impersonate/${userId}`)
      const token = response.data.token

      Cookies.set('token', token, { path: '/', sameSite: 'Strict' })

      //wait for 500ms before redirecting to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 500)

      toast.success(response.data.message || "Impersonated successfully");
    } catch (error) {
      if(error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Failed to impersonate");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  return (
    <div className="space-y-4 py-8">
        <Table>
            <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px] hidden md:table-cell"></TableHead>
                <TableHead className="w-[150px]">Username</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Join Date</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Impersonate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedUsers.length > 0 ? (
                    sortedUsers.map((user: UserData) => (
                        <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell className="py-4 hidden md:table-cell">
                            <div className="ml-2 h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                <User2 className="h-6 w-6 text-muted-foreground" />
                            </div>
                        </TableCell>
                        <TableCell className="font-medium">
                            <div className="flex flex-col gap-0.5">
                                <span className="font-medium capitalize">{user.username}</span>
                                <span className="text-sm text-muted-foreground md:hidden">
                                    {user.email}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            {user.email}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            {user.created_at ? 
                            format(new Date(user.created_at), 'MMM d, yyyy') : 
                            'Unknown'}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            <Badge
                                variant={isBanned(user) ? "destructive" : "default"}
                            >
                                {isBanned(user) ? "Banned" : "Active"}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Button variant="outline" size="sm" onClick={() => handleImpersonate(user.id)}>
                                Impersonate
                            </Button>
                        </TableCell>
                        <TableCell>
                            <Select
                                value={user.role || "user"}
                                onValueChange={(value) => handleRoleChange(user.id, value)}
                            >
                                <SelectTrigger className="w-[110px]">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.value} value={role.value}>
                                            {role.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => isBanned(user) 
                                      ? handleUnban(user.id) 
                                      : openBanModal(user.id)
                                    }
                                    className="cursor-pointer"
                                  >
                                    {isBanned(user) ? (
                                      <>
                                        <Check className="mr-2 h-4 w-4" />
                                        <span>Unban User</span>
                                      </>
                                    ) : (
                                      <>
                                        <Ban className="mr-2 h-4 w-4" />
                                        <span>Ban User</span>
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => window.open(user.store_url, '_blank')}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-2 h-4 w-4"
                                    >
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                    <span>Visit Store</span>
                                </DropdownMenuItem>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                          onSelect={(e) => {
                                              e.preventDefault();
                                              setUserToDisablePayouts(user.id);
                                          }}
                                          className="cursor-pointer"
                                      >
                                        {isPayoutsDisabled(user) ? (
                                          <>
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            <span>Enable Payouts</span>
                                          </>
                                        ) : (
                                          <>
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            <span>Disable Payouts</span>
                                          </>
                                        )}
                                      </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                      <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                          This action cannot be undone. This will permanently disable payouts for the user.
                                      </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => {
                                          if (!userToDisablePayouts) return
                                          if (isPayoutsDisabled(user)) {
                                            handleEnablePayouts(userToDisablePayouts)
                                          } else {
                                            handleDisablePayouts(userToDisablePayouts)
                                          }
                                        }}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        {isPayoutsDisabled(user) ? "Enable Payouts" : "Disable Payouts"}
                                      </AlertDialogAction>
                                      </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                <hr className="my-1" />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                          onSelect={(e) => {
                                              e.preventDefault();
                                              setUserToDelete(user.id);
                                          }}
                                          className="cursor-pointer text-destructive focus:text-destructive"
                                      >
                                      <Trash className="mr-2 h-4 w-4" />
                                      <span>Delete User</span>
                                      </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                      <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete the user
                                          and all associated data including their products and content.
                                      </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                          onClick={() => userToDelete && handleDeleteUser(userToDelete)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                          Delete
                                      </AlertDialogAction>
                                      </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                        {search ? 'No users found matching your search.' : 'No users found.'}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
        

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing page {page} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={banModalOpen} onOpenChange={setBanModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ban User </DialogTitle>
            <DialogDescription>
              Please provide a reason for banning this user. This information will be stored for administrative purposes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="ban-reason">Reason for ban</Label>
              <Textarea
                id="ban-reason"
                placeholder="Enter reason for banning this user..."
                value={banReason || ''}
                onChange={(e) => setBanReason(e.target.value)}
                className="resize-none"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={submitBan}
            >
              Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}