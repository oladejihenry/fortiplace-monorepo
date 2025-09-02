"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "@/lib/axios";
import { PaginatedResponse } from "@/types/product";

export function useInfiniteProducts(initialUrl: string) {
  const [products, setProducts] = useState<any[]>([]);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!nextPageUrl || isLoading) return;
    setIsLoading(true);
    try {
      const res = await axios.get(nextPageUrl);
      const data: PaginatedResponse<any> = res.data;
      setProducts(prev => [...prev, ...data.data]);
      setNextPageUrl(data.links.next);
      setHasMore(!!data.links.next);
    } finally {
      setIsLoading(false);
    }
  }, [nextPageUrl, isLoading]);

  // Fetch the first page on mount
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { products, fetchProducts, isLoading, hasMore };
}