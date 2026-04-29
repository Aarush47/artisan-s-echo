import { useState } from "react";
import { deleteProductListing } from "@/lib/productListings";

export function useDeleteProduct() {
  const [isPending, setIsPending] = useState(false);

  async function mutate({ id, userId }: { id: string; userId: string }) {
    setIsPending(true);
    try {
      await deleteProductListing(id, userId);
    } finally {
      setIsPending(false);
    }
  }

  return { mutate, isPending };
}
