import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { Product } from "../types/Product";
interface UseSearchProductsParams {
  query: string;
  category: string;
  minPrice?: number;
  maxPrice?: number;
}

export const useGetProductsQuery = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () => (await apiClient.get<Product[]>(`api/products`)).data,
  });

export const useGetProductDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ["products", slug],
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/slug/${slug}`)).data,
  });

export const useGetCategoriesQuery = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      (await apiClient.get<[]>(`/api/products/categories`)).data,
  });

export const useSearchProducts = ({
  query,
  category,
  minPrice,
  maxPrice,
}: UseSearchProductsParams) =>
  useQuery({
    queryKey: ["searchProducts", query, category, minPrice, maxPrice],
    queryFn: async () => {
      const { data } = await apiClient.get(`api/products/search`, {
        params: { query, category, minPrice, maxPrice },
      });
      return data;
    },
  });
