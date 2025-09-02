import NotFoundComponent from "@/components/sites/not-found"

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Not Found",
  description: "The page you are looking for does not exist",
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <NotFoundComponent />
    </div>
  )
}