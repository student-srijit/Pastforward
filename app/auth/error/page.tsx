"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-gray-900 p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Authentication Error</h1>
          <p className="mt-2 text-gray-300">There was a problem signing you in.</p>

          <div className="mt-4 p-4 bg-gray-800 rounded-md text-left">
            <p className="text-sm text-gray-300 font-mono">Error: {error || "Unknown error"}</p>
          </div>

          <div className="mt-6">
            <Link href="/auth/signin">
              <Button className="w-full">Try Again</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
