import { useEffect, useState } from "react";
import { getProductListings, type ProductListing } from "@/lib/productListings";

export function useSellerListings(sellerId?: string) {
  const [data, setData] = useState<{ data: ProductListing[]; error: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadListings() {
      if (!sellerId) {
        if (isMounted) {
          setData({ data: [], error: null });
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      const result = await getProductListings();
      const listings = (result.data ?? []).filter((listing) => listing.seller_id === sellerId);

      if (!isMounted) return;

      setData({ data: listings, error: result.error });
      setIsLoading(false);
    }

    loadListings();

    return () => {
      isMounted = false;
    };
  }, [sellerId]);

  return { data, isLoading };
}
