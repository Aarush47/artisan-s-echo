import { useEffect, useRef } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useUser } from '@clerk/react';
import { useSellerListings } from '@/hooks/useSellerListings';
import { useDeleteProduct } from '@/hooks/useProductMutations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader, Trash2, Plus } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const Route = createFileRoute('/marketplace/my-listings')({
  head: () => ({
    meta: [
      { title: 'My Listings | A.Rai Marketplace' },
      { name: 'description', content: 'Manage your product listings' },
    ],
  }),
  component: MyListingsPage,
});

function MyListingsPage() {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const carouselApiRef = useRef<CarouselApi | null>(null);
  const autoRotateRef = useRef<number | null>(null);

  const { data: listingsResult, isLoading } = useSellerListings(isSignedIn ? user?.id : undefined);
  const listings = listingsResult?.data || [];

  const deleteProduct = useDeleteProduct();

  useEffect(() => {
    if (autoRotateRef.current) {
      window.clearInterval(autoRotateRef.current);
      autoRotateRef.current = null;
    }

    if (listings.length < 2) {
      return;
    }

    autoRotateRef.current = window.setInterval(() => {
      carouselApiRef.current?.scrollNext();
    }, 4000);

    return () => {
      if (autoRotateRef.current) {
        window.clearInterval(autoRotateRef.current);
        autoRotateRef.current = null;
      }
    };
  }, [listings.length]);

  if (!isSignedIn || !user) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to View Listings</h2>
          <p className="text-muted-foreground mb-4">Sign in to manage your products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Listings</h1>
        <Button
          onClick={() => window.location.assign('/#sell')}
          className="bg-accent-amber hover:bg-accent-amber-hover text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-accent-amber" />
        </div>
      ) : listings.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground text-lg mb-4">You haven't listed any products yet</p>
          <Button
            onClick={() => window.location.assign('/#sell')}
            className="bg-accent-amber hover:bg-accent-amber-hover text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Product
          </Button>
        </Card>
      ) : (
        <Carousel
          className="w-full"
          opts={{ align: 'start', loop: listings.length > 1 }}
          setApi={(api) => {
            carouselApiRef.current = api;
          }}
        >
          <CarouselContent className="-ml-4">
            {listings.map((product) => (
              <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden flex h-full flex-col">
                  <div className="relative h-56 bg-muted overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-amber/20 to-accent-amber/5">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}

                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          product.is_available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.is_available ? 'Available' : 'Sold'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {product.description}
                      </p>
                    )}

                    <div className="flex-1" />

                    <div className="mb-4">
                      <p className="text-lg font-bold text-accent-amber">
                        ₹{product.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Listed: {new Date(product.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate({ to: `/marketplace/product/${product.id}` })}
                      >
                        View
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" className="flex-shrink-0">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{product.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                          <div className="flex gap-3 justify-end">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                deleteProduct.mutate({
                                  id: product.id,
                                  userId: user.id,
                                })
                              }
                              disabled={deleteProduct.isPending}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      )}
    </div>
  );
}
