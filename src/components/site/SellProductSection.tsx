import { useEffect, useMemo, useState } from "react";
import { useUser, SignInButton, SignUpButton } from "@clerk/react";
import { ImagePlus, LoaderCircle, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProductListing, deleteProductListing, type ProductListing } from "@/lib/productListings";
import { getSellerProfile, type SellerProfile } from "@/lib/sellerProfiles";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

interface SellProductSectionProps {
  onProductCreated?: () => void;
}

export function SellProductSection({ onProductCreated }: SellProductSectionProps) {
  const { isSignedIn, user } = useUser();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [latestListing, setLatestListing] = useState<ProductListing | null>(null);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSellerProfile() {
      if (!isSignedIn || !user) {
        if (isMounted) {
          setSellerProfile(null);
          setProfileError(null);
          setProfileLoading(false);
        }
        return;
      }

      setProfileLoading(true);
      const result = await getSellerProfile(user.id);

      if (!isMounted) return;

      setSellerProfile(result.data);
      setProfileError(result.error);
      setProfileLoading(false);
    }

    loadSellerProfile();

    return () => {
      isMounted = false;
    };
  }, [isSignedIn, user?.id]);

  const canSubmit = useMemo(() => {
    return isSignedIn && !!user && name.trim() && price.trim() && contactNumber.trim() && imageFile;
  }, [isSignedIn, user, name, price, contactNumber, imageFile]);

  function resetForm() {
    setName("");
    setPrice("");
    setContactNumber("");
    setDescription("");
    setImageFile(null);
    setImagePreview("");
  }

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be 5MB or smaller.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(typeof reader.result === "string" ? reader.result : "");
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isSignedIn || !user) {
      toast.error("Please sign in first.");
      return;
    }

    if (!sellerProfile) {
      toast.error("Complete your seller profile before listing products.");
      return;
    }

    if (sellerProfile.is_blocked) {
      toast.error("Your seller account is blocked. Please contact an admin.");
      return;
    }

    if (!canSubmit || !imageFile) {
      toast.error("Add a photo, name, price, and contact number.");
      return;
    }

    const parsedPrice = Number(price);

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error("Enter a valid price.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createProductListing({
        sellerId: user.id,
        name: name.trim(),
        price: parsedPrice,
        contactNumber: contactNumber.trim(),
        description: description.trim() || undefined,
        imageFile,
      });

      if (!result.data) {
        toast.error(result.error ?? "Failed to save product.");
        return;
      }

      setLatestListing(result.data);
      resetForm();

      if (result.error) {
        toast.warning(result.error);
      } else {
        toast.success("Product added successfully.");
      }

      onProductCreated?.();
    } catch {
      toast.error("Network error while saving product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRemoveLatest() {
    if (!latestListing || !user) return;

    if (latestListing.seller_id !== user.id) {
      toast.error("You can remove only products added by your account.");
      return;
    }

    setIsDeleting(true);
    const result = await deleteProductListing(latestListing.id, user.id);
    setIsDeleting(false);

    if (!result.ok) {
      toast.error(result.error ?? "Unable to remove product.");
      return;
    }

    setLatestListing(null);
    toast.success("Product removed.");
    onProductCreated?.();
  }

  return (
    <section id="sell" className="bg-bg-warm px-6 md:px-12 py-16 md:py-20">
      <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-start">
        <div className="space-y-5 max-w-xl">
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted-warm">
            Sell your craft
          </p>
          <h2 className="font-display text-3xl md:text-5xl leading-[1.05] text-foreground">
            Add a handmade product after you sign in.
          </h2>
          <p className="text-sm md:text-base text-text-muted-warm leading-[1.8]">
            Signed-in users can list a product with a photo, name, price, contact number, and an
            optional description. The form saves directly to Supabase and keeps the experience
            inside the site.
          </p>

          {!isSignedIn ? (
            <Card className="p-6 bg-card-warm border border-card-warm-border">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-accent-amber/15 p-2 text-accent-amber">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl text-foreground">Sign in to list products</h3>
                  <p className="mt-2 text-sm text-text-muted-warm leading-[1.7]">
                    Create an account or sign in to start selling your handmade items.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <SignInButton mode="modal">
                      <button className="bg-foreground text-text-light px-4 py-2 text-[10px] uppercase tracking-[0.15em] hover:bg-foreground/90 transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal" forceRedirectUrl="/seller-onboarding">
                      <button className="border border-foreground px-4 py-2 text-[10px] uppercase tracking-[0.15em] hover:bg-foreground hover:text-text-light transition-colors">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                </div>
              </div>
            </Card>
          ) : profileLoading ? (
            <Card className="p-6 bg-card-warm border border-card-warm-border">
              <div className="flex items-center gap-3 text-text-muted-warm">
                <LoaderCircle className="h-5 w-5 animate-spin text-accent-amber" />
                Checking seller profile...
              </div>
            </Card>
          ) : profileError ? (
            <Card className="p-6 bg-card-warm border border-card-warm-border">
              <h3 className="font-display text-xl text-foreground">Seller profile unavailable</h3>
              <p className="mt-2 text-sm text-text-muted-warm leading-[1.7]">{profileError}</p>
            </Card>
          ) : !sellerProfile ? (
            <Card className="p-6 bg-card-warm border border-card-warm-border">
              <h3 className="font-display text-xl text-foreground">Complete your seller profile</h3>
              <p className="mt-2 text-sm text-text-muted-warm leading-[1.7]">
                Add your name, photo, contact number, address, and verification documents before
                listing products.
              </p>
              <Button
                type="button"
                className="mt-5 bg-accent-amber hover:bg-accent-amber-hover text-white"
                onClick={() => window.location.assign("/seller-onboarding")}
              >
                Complete Seller Profile
              </Button>
            </Card>
          ) : sellerProfile.is_blocked ? (
            <Card className="p-6 bg-card-warm border border-red-200">
              <h3 className="font-display text-xl text-foreground">Seller account blocked</h3>
              <p className="mt-2 text-sm text-text-muted-warm leading-[1.7]">
                {sellerProfile.blocked_reason ?? "Your account has been blocked by an admin."}
              </p>
            </Card>
          ) : (
            <Card className="p-6 bg-card-warm border border-card-warm-border shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
              <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted-warm mb-5">
                Signed in as {user?.firstName ?? "seller"}
              </p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product name</Label>
                  <Input
                    id="product-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Handmade ceramic vase"
                    maxLength={100}
                    required
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Price</Label>
                    <Input
                      id="product-price"
                      type="number"
                      min="1"
                      step="0.01"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                      placeholder="1499"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-number">Contact number</Label>
                    <Input
                      id="contact-number"
                      value={contactNumber}
                      onChange={(event) => setContactNumber(event.target.value)}
                      placeholder="9876543210"
                      inputMode="tel"
                      maxLength={20}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-description">Product description (optional)</Label>
                  <Textarea
                    id="product-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Share details like size, material, finish, or care instructions"
                    rows={4}
                    maxLength={500}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-image">Product photo</Label>
                  <label
                    htmlFor="product-image"
                    className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-card-warm-border bg-bg-warm/60 px-4 py-6 text-center transition-colors hover:border-accent-amber hover:bg-accent-amber/5"
                  >
                    <ImagePlus className="h-6 w-6 text-accent-amber" />
                    <span className="text-sm text-foreground">Click to upload an image</span>
                    <span className="text-xs text-text-muted-warm">PNG, JPG, WebP up to 5MB</span>
                    <input
                      id="product-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {imagePreview && (
                  <div className="overflow-hidden rounded-xl border border-card-warm-border">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="h-56 w-full object-cover"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting || !canSubmit}
                  className="w-full bg-accent-amber hover:bg-accent-amber-hover text-white"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Saving product
                    </>
                  ) : (
                    "Add Product"
                  )}
                </Button>
              </form>
            </Card>
          )}
        </div>

        <div className="lg:pt-10">
          <Card className="overflow-hidden border border-card-warm-border bg-card-warm">
            <div className="border-b border-card-warm-border px-6 py-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted-warm">
                Recent listing
              </p>
            </div>

            {latestListing ? (
              <div>
                <img
                  src={latestListing.image_url}
                  alt={latestListing.name}
                  className="h-72 w-full object-cover"
                />
                <div className="space-y-3 px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl text-foreground">{latestListing.name}</h3>
                      {latestListing.description && (
                        <p className="mt-1 text-sm leading-[1.6] text-text-muted-warm">
                          {latestListing.description}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-text-muted-warm">
                        Contact: {latestListing.contact_number}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-accent-amber">
                      ₹{Number(latestListing.price).toFixed(2)}
                    </p>
                  </div>
                  {user && latestListing.seller_id === user.id && (
                    <Button
                      type="button"
                      onClick={handleRemoveLatest}
                      disabled={isDeleting}
                      variant="outline"
                      className="w-full"
                    >
                      {isDeleting ? (
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
              </div>
            ) : (
              <div className="flex min-h-96 items-center justify-center px-6 py-10 text-center">
                <div className="max-w-sm">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-amber/10 text-accent-amber">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground">Your listing preview</h3>
                  <p className="mt-3 text-sm text-text-muted-warm leading-[1.7]">
                    After you submit the form, the latest product will appear here so you can
                    confirm the image, price, and contact details.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}