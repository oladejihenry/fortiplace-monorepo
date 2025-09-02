"use server"

import { cookies } from "next/headers"
import { PaginatedResponse, Product } from "@/types/product"
import { cache } from "react"
import { redirect } from "next/navigation"
interface GetProductsParams {
  page?: number
  per_page?: number
  search?: string
}

export const getProducts = async (params?: GetProductsParams) => {
    try {
        const searchParams = new URLSearchParams({
            page: String(params?.page || 1),
            per_page: String(params?.per_page || 15),
            ...(params?.search && { search: params.search }),
        })

        const cookieStore = await cookies()
        const xsrfToken = cookieStore.get('XSRF-TOKEN')?.value
        const laravelSession = cookieStore.get(process.env.NEXT_PUBLIC_COOKIE_NAME || 'laravel_session')?.value
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/products?${searchParams}`
        const token = cookieStore.get('token')?.value
        
        const products = await fetch(
            url,
            {
                headers: new Headers({
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    Referer: process.env.NEXT_PUBLIC_FRONTEND_URL || '',
                    Cookie: `XSRF-TOKEN=${xsrfToken};${process.env.NEXT_PUBLIC_COOKIE_NAME}=${laravelSession}`,
                    Authorization: `Bearer ${token}`,
                }),
                next: { 
                    revalidate: 5,
                    tags: ['products']
                }
            },
        )

        // if(!products.ok) {
        //     return { status: products.status }
        // }
 
        const data: PaginatedResponse<Product> = await products.json()
        return data
    } catch (error) {
        //if product returns 401, redirect to login
        if(error instanceof Error && 'status' in error && error.status === 401) {
            redirect('/login')
        }
        throw error
    }
}

export const getProductById = cache(async (productId: string) => {
    try {
        const cookieStore = await cookies()
        const xsrfToken = cookieStore.get('XSRF-TOKEN')?.value
        const laravelSession = cookieStore.get(process.env.NEXT_PUBLIC_COOKIE_NAME || 'laravel_session')?.value
        
        const product = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, 
            {
                headers: new Headers({
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    Referer: process.env.NEXT_PUBLIC_FRONTEND_URL || '',
                    Cookie: `XSRF-TOKEN=${xsrfToken};${process.env.NEXT_PUBLIC_COOKIE_NAME}=${laravelSession}`,
                }),
                next: {
                    revalidate: 60,
                    tags: [`product-${productId}`, 'products'],
                },
            }
        )

        if(!product.ok) {
            return { status: product.status }
        }
        
        const data = await product.json()
        return data
    } catch (error) {
        //if product returns 401, redirect to login
        if(error instanceof Error && 'status' in error && error.status === 401) {
            redirect('/login')
        }
        throw error
    }
})
