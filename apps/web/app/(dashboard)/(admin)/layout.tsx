import { AdminProtected } from "@/components/auth/admin/admin-protected";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    const isAdmin = user?.data?.role == 'admin';

    if(!isAdmin) {
        redirect('/dashboard')
    }

    return (
        <AdminProtected>
            {children}
        </AdminProtected>
    )
}