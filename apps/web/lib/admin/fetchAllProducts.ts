import { toast } from "sonner";
import axios from "../axios";
import { AxiosError } from "axios";

export async function fetchProducts() {
    try {
      const response = await axios.get('/api/admin/products');
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
        throw error.response?.data
      }
      toast.error("Failed to load products");
    }
  };