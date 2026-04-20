import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/react";
import { Phone, Store, Trash2, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteProductListing, getProductListings, type ProductListing } from "@/lib/productListings";

export function MarketplaceSection({ refreshToken }: { refreshToken: number }) {
  const { isSignedIn, user } = useUser();
  const [listings, setListings] = useState<ProductListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadListings() {
      setIsLoading(true);
      const result = await getProductListings();

      if (!isMounted) return;

      setListings(result.data ?? []);
      setStatusMessage(result.error);
      setIsLoading(false);
    }

    loadListings();

    return () => {
      isMounted = false;
    };
  }, [refreshToken]);

  const hasListings = useMemo(() => listings.length > 0, [listings.length]);

  async function handleDelete(item: ProductListing) {
    if (!isSignedIn || !user) {
      toast.error("Please sign in to remove your product.");
      return;
    }

    if (item.seller_id !== user.id) {
      toast.error("You can remove only products added by your account.");
      return;
    }

    setDeletingId(item.id);
    const result = await deleteProductListing(item.id, user.id);
    setDeletingId(null);

    if (!result.ok) {
      toast.error(result.error ?? "Unable to remove product.");
      return;
    }

    setListings((current) => current.filter((entry) => entry.id !== item.id));
    toast.success("Product removed.");
  }

  return (
    <section id="marketplace" className="bg-bg-warm px-6 md:px-12 py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted-warm">
              Marketplace
            </p>
            <h2 className="font-display text-3xl md:text-5xl leading-[1.05] text-foreground mt-2">
              Explore and contact sellers directly.
            </h2>
            <p className="text-sm md:text-base text-text-muted-warm mt-4 max-w-2xl leading-[1.8]">
              When you want to buy a product, open the listing and use the contact number shown
              below each item.
            </p>
          </div>
        </div>

        {statusMessage && (
          <Card className="mb-6 border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {statusMessage}
          </Card>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Card key={idx} className="h-80 animate-pulse bg-muted" />
            ))}
          </div>
        ) : !hasListings ? (
          <Card className="p-8 text-center border border-card-warm-border">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-amber/10 text-accent-amber">
              <Store className="h-5 w-5" />
            </div>
            <h3 className="font-display text-2xl text-foreground">No products listed yet</h3>
            <p className="mt-2 text-sm text-text-muted-warm">
              Ask a seller to add their first product using the sell form.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <Card key={item.id} className="overflow-hidden border border-card-warm-border bg-card-warm">
                <div className="h-56 bg-muted overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-2xl text-foreground leading-tight">{item.name}</h3>
                    <p className="text-lg font-semibold text-accent-amber">₹{Number(item.price).toFixed(2)}</p>
                  </div>

                  <div className="rounded-lg bg-bg-warm px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-text-muted-warm">
                      Seller contact number
                    </p>
                    <p className="text-base text-foreground mt-1">{item.contact_number}</p>
                  </div>

                  <Button asChild className="w-full bg-accent-amber hover:bg-accent-amber-hover text-white">
                    <a href={`tel:${item.contact_number.replace(/\s+/g, "")}`}>
                      <Phone className="h-4 w-4" />
                      Contact Seller
                    </a>
                  </Button>

                  {isSignedIn && user?.id === item.seller_id && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? (
                        <>
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          Removing
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          Remove Product
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
