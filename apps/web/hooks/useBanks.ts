import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";


interface Bank {
  id: number;
  name: string;
  code: string;
}

// interface BanksResponse {
//   data: Bank[];
//   message?: string;
//   status?: string;
// }

export function useBanks() {
  const { data: banksResponse, isLoading, isError, error, refetch } = useQuery<Bank[]>({
    queryKey: ["banks"],
    queryFn: async () => {
      const {data} = await axios.get("/api/bank/bank-list");
      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return {
    data: banksResponse,
    isLoading,
    isError,
    error,
    refetch,
  };
}