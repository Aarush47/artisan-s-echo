import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { s as supabase } from "./router-DkzG_Dwk.mjs";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const Card = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const ADMIN_EMAIL_ALLOWLIST = ["aarushdineshyadav@gmail.com"];
function isAllowedAdminEmail(email) {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) return false;
  return ADMIN_EMAIL_ALLOWLIST.includes(normalizedEmail);
}
function toErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Unable to read file."));
    };
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
}
async function getSellerProfile(clerkUserId) {
  try {
    if (!clerkUserId) {
      return { data: null, error: "Missing seller identity." };
    }
    const { data, error } = await supabase.from("seller_profiles").select("*").eq("clerk_user_id", clerkUserId).maybeSingle();
    if (error) {
      return { data: null, error: error.message };
    }
    return { data: data ?? null, error: null };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}
async function upsertSellerProfile(input) {
  try {
    const existingProfileResult = await getSellerProfile(input.clerkUserId);
    const existingProfile = existingProfileResult.data;
    const payload = {
      clerk_user_id: input.clerkUserId,
      full_name: input.fullName,
      phone_number: input.phoneNumber,
      address: input.address,
      government_id_type: input.governmentIdType,
      government_id_number: input.governmentIdNumber,
      profile_photo_url: input.profilePhotoUrl ?? null,
      government_id_url: input.governmentIdUrl ?? null,
      role: existingProfile?.role ?? "seller",
      verification_status: existingProfile?.verification_status ?? "pending",
      is_blocked: existingProfile?.is_blocked ?? false,
      blocked_reason: existingProfile?.blocked_reason ?? null,
      blocked_at: existingProfile?.blocked_at ?? null,
      blocked_by_admin_id: existingProfile?.blocked_by_admin_id ?? null
    };
    const { data, error } = await supabase.from("seller_profiles").upsert(payload, { onConflict: "clerk_user_id" }).select("*").single();
    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}
async function isAdminUser(clerkUserId) {
  try {
    if (!clerkUserId) return false;
    const { data, error } = await supabase.from("admins").select("id").eq("clerk_user_id", clerkUserId).maybeSingle();
    if (error || !data) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
async function isAdminIdentity(clerkUserId, email) {
  if (isAllowedAdminEmail(email)) {
    return true;
  }
  if (!clerkUserId) {
    return false;
  }
  return isAdminUser(clerkUserId);
}
async function getSellerProfilesWithCounts() {
  try {
    const [profilesResult, productsResult] = await Promise.all([
      supabase.from("seller_profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("seller_id, contact_number")
    ]);
    if (profilesResult.error) {
      return { data: null, error: profilesResult.error.message };
    }
    const counts = /* @__PURE__ */ new Map();
    const latestContact = /* @__PURE__ */ new Map();
    for (const row of productsResult.data ?? []) {
      const sellerId = row.seller_id;
      if (!sellerId) continue;
      counts.set(sellerId, (counts.get(sellerId) ?? 0) + 1);
      const contact = row.contact_number;
      if (contact && !latestContact.has(sellerId)) {
        latestContact.set(sellerId, contact);
      }
    }
    const profiles = profilesResult.data ?? [];
    const data = profiles.map((profile) => ({
      ...profile,
      product_count: counts.get(profile.clerk_user_id) ?? 0,
      has_profile: true,
      latest_contact_number: latestContact.get(profile.clerk_user_id) ?? null
    }));
    const profileIds = new Set(profiles.map((profile) => profile.clerk_user_id));
    for (const [sellerId, count] of counts.entries()) {
      if (profileIds.has(sellerId)) continue;
      data.push({
        id: `missing-${sellerId}`,
        clerk_user_id: sellerId,
        full_name: "Profile Pending",
        phone_number: latestContact.get(sellerId) ?? "Not provided",
        address: "Seller has not completed onboarding yet.",
        government_id_type: "Pending",
        government_id_number: "Pending",
        profile_photo_url: null,
        government_id_url: null,
        role: "seller",
        verification_status: "pending",
        is_blocked: false,
        blocked_reason: null,
        blocked_at: null,
        blocked_by_admin_id: null,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString(),
        product_count: count,
        has_profile: false,
        latest_contact_number: latestContact.get(sellerId) ?? null
      });
    }
    return {
      data,
      error: productsResult.error?.message ?? null
    };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}
async function createSellerProfilePlaceholder(clerkUserId, fallbackPhone) {
  try {
    const { data, error } = await supabase.from("seller_profiles").upsert(
      {
        clerk_user_id: clerkUserId,
        full_name: `Seller ${clerkUserId.slice(0, 8)}`,
        phone_number: fallbackPhone?.trim() || "Not provided",
        address: "Pending seller address.",
        government_id_type: "Pending",
        government_id_number: "Pending",
        role: "seller",
        verification_status: "pending",
        is_blocked: false
      },
      { onConflict: "clerk_user_id" }
    ).select("*").single();
    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}
async function blockSellerProfile(sellerProfileId, blockedByAdminId, blocked, blockedReason) {
  try {
    const patch = blocked ? {
      is_blocked: true,
      blocked_reason: blockedReason?.trim() || "Blocked by admin.",
      blocked_at: (/* @__PURE__ */ new Date()).toISOString(),
      blocked_by_admin_id: blockedByAdminId
    } : {
      is_blocked: false,
      blocked_reason: null,
      blocked_at: null,
      blocked_by_admin_id: null
    };
    const { data, error } = await supabase.from("seller_profiles").update(patch).eq("id", sellerProfileId).select("*").single();
    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}
async function promoteSellerProfileToAdmin(sellerProfileId, clerkUserId, promotedByAdminId) {
  try {
    const profileUpdate = await supabase.from("seller_profiles").update({ role: "admin", verification_status: "verified" }).eq("id", sellerProfileId).select("*").single();
    if (profileUpdate.error) {
      return { data: null, error: profileUpdate.error.message };
    }
    const adminInsert = await supabase.from("admins").upsert(
      {
        clerk_user_id: clerkUserId,
        seller_profile_id: sellerProfileId,
        promoted_by_admin_id: promotedByAdminId
      },
      { onConflict: "clerk_user_id" }
    );
    if (adminInsert.error) {
      return { data: null, error: adminInsert.error.message };
    }
    return { data: profileUpdate.data, error: null };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}
async function updateSellerVerificationStatus(sellerProfileId, status) {
  try {
    const { data, error } = await supabase.from("seller_profiles").update({ verification_status: status }).eq("id", sellerProfileId).select("*").single();
    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}
export {
  Button as B,
  Card as C,
  updateSellerVerificationStatus as a,
  blockSellerProfile as b,
  createSellerProfilePlaceholder as c,
  getSellerProfilesWithCounts as d,
  cn as e,
  isAdminIdentity as f,
  getSellerProfile as g,
  buttonVariants as h,
  isAllowedAdminEmail as i,
  promoteSellerProfileToAdmin as p,
  readFileAsDataUrl as r,
  upsertSellerProfile as u
};
