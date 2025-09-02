'use client'

import axios from "@/lib/axios"
import { AxiosError } from "axios"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface Props {
  id: string
  hash: string
}

export function ActualVerify({ id, hash }: Props) {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function verifyEmail() {
      try {
        const expires = searchParams.get('expires')
        const signature = searchParams.get('signature')
        if (!expires || !signature) {
          setStatus("error")
          setMessage("Invalid verification link.")
          return
        }
        


        // Make the GET request to the Laravel verification endpoint
        const response = await axios.get(`/verify-email/${id}/${hash}`, {
          params: { expires, signature },

        })

        if (response.data.verified === true) {
          setStatus("success")
          setMessage(response.data.message || "Email verified successfully!")
          window.location.href = "/dashboard"
        } else {
          setStatus("error")
          setMessage("Verification failed. Please try again.")
        }
      } catch (error) {
        setStatus("error")
        if (error instanceof AxiosError) {
          setMessage(
            error?.response?.data?.message ||
            "Verification failed. The link may have expired or is invalid."
          )
        } else {
          setMessage("Verification failed. Please try again.")
        }
      }
    }
    verifyEmail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (status === "loading") return <div>Verifying your email...</div>
  if (status === "success") return <div>{message} Redirecting...</div>
  return <div className="text-red-500">{message}</div>
}