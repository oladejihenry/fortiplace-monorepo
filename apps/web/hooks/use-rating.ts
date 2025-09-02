import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "@/lib/axios"
import { toast } from "sonner"

interface Rating {
  id: string
  product_id: string
  user_id: string | null
  rating: number
  session_id: string
  created_at: string
  updated_at: string
}

interface RatingResponse {
  ratings: Rating[]
}

export function useRating(productId: string) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (rating: number) => {
      const response = await axios.post<RatingResponse>(`/api/products/${productId}/rate`, {
        rating
      })
      return response.data
    },
    onSuccess: (data) => {
      toast.success("Rating submitted successfully")
      // You might want to update your product data here
      queryClient.invalidateQueries({ queryKey: ['product', productId] })
    },
    onError: () => {
      toast.error("Failed to submit rating")
    }
  })

  const handleRate = async (rating: number) => {
    if (isLoading) return
    setIsLoading(true)
    try {
      await mutation.mutateAsync(rating)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    handleRate,
    isLoading: isLoading || mutation.isPending
  }
}