import { Button } from "@workspace/ui/components/button"
import { Users, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function EmptyCustomers() {
  const router = useRouter()

  return (
    <div className="mt-10 flex min-h-[400px] flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Users className="h-10 w-10 text-primary" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">No Sales made yet</h2>
        <p className="mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
          Customer details, including email addresses, will appear here when they make purchases from your FortiPlace store.
        </p>
        <Button
          onClick={() => router.push('/products/new')}
          className="mt-6"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Product
        </Button>
      </div>
    </div>
  )
}