import { Percent } from 'lucide-react'

export function EmptyCoupons() {
  return (
    <div className="animate-in fade-in-50 mt-10 flex min-h-[400px] flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-full">
          <Percent className="text-primary h-10 w-10" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">No Coupons created yet</h2>
        <p className="text-muted-foreground mt-2 text-center text-sm font-normal leading-6">
          Coupons will appear here when you create them.
        </p>
      </div>
    </div>
  )
}
