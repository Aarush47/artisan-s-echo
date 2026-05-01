import { s as supabase } from "./router-DkzG_Dwk.mjs";
import { g as getSellerProfile } from "./sellerProfiles-DEIg_NqB.mjs";
const LOCAL_LISTINGS_KEY = "artisan-echo-product-listings";
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Unable to read image file."));
    };
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });
}
function readLocalListings() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_LISTINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function writeLocalListings(listings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_LISTINGS_KEY, JSON.stringify(listings));
  } catch {
  }
}
function removeLocalListing(productId, sellerId) {
  const existing = readLocalListings();
  const next = existing.filter((item) => !(item.id === productId && item.seller_id === sellerId));
  writeLocalListings(next);
}
function createLocalListing(input, imageUrl) {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    seller_id: input.sellerId,
    name: input.name,
    price: input.price,
    contact_number: input.contactNumber,
    description: input.description ?? null,
    image_url: imageUrl,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function getProductListings() {
  try {
    const [productsResult, sellersResult] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("seller_profiles").select("clerk_user_id, is_blocked")
    ]);
    if (productsResult.error) {
      return { data: readLocalListings(), error: productsResult.error.message };
    }
    const blockedSellerIds = new Set(
      sellersResult.error ? [] : (sellersResult.data ?? []).filter((seller) => Boolean(seller.is_blocked)).map((seller) => seller.clerk_user_id).filter((sellerId) => Boolean(sellerId))
    );
    const remote = (productsResult.data ?? []).filter(
      (listing) => !blockedSellerIds.has(listing.seller_id)
    );
    const local = readLocalListings().filter((listing) => !blockedSellerIds.has(listing.seller_id));
    const merged = [...local, ...remote].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return {
      data: merged,
      error: sellersResult.error ? sellersResult.error.message : null
    };
  } catch {
    return {
      data: readLocalListings(),
      error: "Could not connect to Supabase. Showing locally saved listings."
    };
  }
}
async function createProductListing(input) {
  try {
    const sellerProfileResult = await getSellerProfile(input.sellerId);
    if (sellerProfileResult.error) {
      return { data: null, error: sellerProfileResult.error };
    }
    if (!sellerProfileResult.data) {
      return { data: null, error: "Complete your seller profile before listing products." };
    }
    if (sellerProfileResult.data.is_blocked) {
      return { data: null, error: "Your seller account is blocked. Please contact an admin." };
    }
    const imageUrl = await readFileAsDataUrl(input.imageFile);
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const localListing = createLocalListing(input, imageUrl);
      const existing = readLocalListings();
      writeLocalListings([localListing, ...existing]);
      return {
        data: localListing,
        error: "You are offline. Product saved locally in this browser."
      };
    }
    try {
      const { data, error } = await supabase.from("products").insert([
        {
          seller_id: input.sellerId,
          name: input.name,
          price: input.price,
          contact_number: input.contactNumber,
          description: input.description ?? null,
          image_url: imageUrl
        }
      ]).select("*").single();
      if (error) {
        return { data: null, error: error.message };
      }
      return { data, error: null };
    } catch {
      const localListing = createLocalListing(input, imageUrl);
      const existing = readLocalListings();
      writeLocalListings([localListing, ...existing]);
      return {
        data: localListing,
        error: "Supabase is unreachable right now. Product saved locally in this browser."
      };
    }
  } catch {
    return { data: null, error: "Unable to process image file." };
  }
}
async function deleteProductListing(productId, sellerId) {
  if (!productId || !sellerId) {
    return { ok: false, error: "Missing product or seller details." };
  }
  try {
    const { data: existingListing, error: lookupError } = await supabase.from("products").select("seller_id").eq("id", productId).single();
    if (lookupError) {
      return { ok: false, error: lookupError.message };
    }
    if (!existingListing || existingListing.seller_id !== sellerId) {
      return { ok: false, error: "You can remove only products added by your account." };
    }
    const { data, error } = await supabase.from("products").delete().eq("id", productId).eq("seller_id", sellerId).select("id");
    if (error) {
      return { ok: false, error: error.message };
    }
    removeLocalListing(productId, sellerId);
    if (!data || data.length === 0) {
      return { ok: false, error: "You can remove only products added by your account." };
    }
    return { ok: true, error: null };
  } catch {
    removeLocalListing(productId, sellerId);
    return { ok: true, error: null };
  }
}
export {
  createProductListing as c,
  deleteProductListing as d,
  getProductListings as g
};
