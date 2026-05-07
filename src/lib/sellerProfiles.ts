import { supabase } from "@/lib/supabase";

export type SellerVerificationStatus = "pending" | "verified" | "rejected";
export const ADMIN_EMAIL_ALLOWLIST = [
  "aarushdineshyadav@gmail.com",
  "arpit.rai@ustu.edu.in",
];

export function isAllowedAdminEmail(email?: string | null) {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) return false;
  return ADMIN_EMAIL_ALLOWLIST.includes(normalizedEmail);
}

export interface SellerProfile {
  id: string;
  clerk_user_id: string;
  full_name: string;
  phone_number: string;
  address: string;
  government_id_type: string;
  government_id_number: string;
  profile_photo_url: string | null;
  government_id_url: string | null;
  role: "seller" | "admin";
  verification_status: SellerVerificationStatus;
  is_blocked: boolean;
  blocked_reason: string | null;
  blocked_at: string | null;
  blocked_by_admin_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface SellerProfileInput {
  clerkUserId: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  governmentIdType: string;
  governmentIdNumber: string;
  profilePhotoUrl?: string | null;
  governmentIdUrl?: string | null;
}

export interface SellerProfileWithCount extends SellerProfile {
  product_count: number;
  has_profile: boolean;
  latest_contact_number: string | null;
}

export interface AdminUserRecord {
  id: string;
  clerk_user_id: string;
  seller_profile_id: string | null;
  promoted_by_admin_id: string | null;
  created_at: string;
}

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
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

export async function getSellerProfile(clerkUserId: string) {
  try {
    if (!clerkUserId) {
      return { data: null, error: "Missing seller identity." };
    }

    const { data, error } = await supabase
      .from("seller_profiles")
      .select("*")
      .eq("clerk_user_id", clerkUserId)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: (data as SellerProfile | null) ?? null, error: null };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}

export async function upsertSellerProfile(input: SellerProfileInput) {
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
      blocked_by_admin_id: existingProfile?.blocked_by_admin_id ?? null,
    };

    const { data, error } = await supabase
      .from("seller_profiles")
      .upsert(payload, { onConflict: "clerk_user_id" })
      .select("*")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as SellerProfile, error: null };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}

export async function isAdminUser(clerkUserId: string) {
  try {
    if (!clerkUserId) return false;

    const { data, error } = await supabase
      .from("admins")
      .select("id")
      .eq("clerk_user_id", clerkUserId)
      .maybeSingle();

    if (error || !data) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function isAdminIdentity(clerkUserId?: string, email?: string | null) {
  if (isAllowedAdminEmail(email)) {
    return true;
  }

  if (!clerkUserId) {
    return false;
  }

  return isAdminUser(clerkUserId);
}

export async function getSellerProfilesWithCounts() {
  try {
    const [profilesResult, productsResult] = await Promise.all([
      supabase.from("seller_profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("seller_id, contact_number"),
    ]);

    if (profilesResult.error) {
      return { data: null, error: profilesResult.error.message };
    }

    const counts = new Map<string, number>();
    const latestContact = new Map<string, string>();
    for (const row of productsResult.data ?? []) {
      const sellerId = (row as { seller_id?: string }).seller_id;
      if (!sellerId) continue;
      counts.set(sellerId, (counts.get(sellerId) ?? 0) + 1);
      const contact = (row as { contact_number?: string }).contact_number;
      if (contact && !latestContact.has(sellerId)) {
        latestContact.set(sellerId, contact);
      }
    }

    const profiles = (profilesResult.data as SellerProfile[]) ?? [];
    const data: SellerProfileWithCount[] = profiles.map((profile) => ({
      ...profile,
      product_count: counts.get(profile.clerk_user_id) ?? 0,
      has_profile: true,
      latest_contact_number: latestContact.get(profile.clerk_user_id) ?? null,
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product_count: count,
        has_profile: false,
        latest_contact_number: latestContact.get(sellerId) ?? null,
      });
    }

    return {
      data,
      error: productsResult.error?.message ?? null,
    };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}

export async function createSellerProfilePlaceholder(clerkUserId: string, fallbackPhone?: string | null) {
  try {
    const { data, error } = await supabase
      .from("seller_profiles")
      .upsert(
        {
          clerk_user_id: clerkUserId,
          full_name: `Seller ${clerkUserId.slice(0, 8)}`,
          phone_number: fallbackPhone?.trim() || "Not provided",
          address: "Pending seller address.",
          government_id_type: "Pending",
          government_id_number: "Pending",
          role: "seller",
          verification_status: "pending",
          is_blocked: false,
        },
        { onConflict: "clerk_user_id" },
      )
      .select("*")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as SellerProfile, error: null };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}

export async function blockSellerProfile(
  sellerProfileId: string,
  blockedByAdminId: string,
  blocked: boolean,
  blockedReason?: string,
) {
  try {
    const patch = blocked
      ? {
          is_blocked: true,
          blocked_reason: blockedReason?.trim() || "Blocked by admin.",
          blocked_at: new Date().toISOString(),
          blocked_by_admin_id: blockedByAdminId,
        }
      : {
          is_blocked: false,
          blocked_reason: null,
          blocked_at: null,
          blocked_by_admin_id: null,
        };

    const { data, error } = await supabase
      .from("seller_profiles")
      .update(patch)
      .eq("id", sellerProfileId)
      .select("*")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as SellerProfile, error: null };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}

export async function promoteSellerProfileToAdmin(
  sellerProfileId: string,
  clerkUserId: string,
  promotedByAdminId: string,
) {
  try {
    const profileUpdate = await supabase
      .from("seller_profiles")
      .update({ role: "admin", verification_status: "verified" })
      .eq("id", sellerProfileId)
      .select("*")
      .single();

    if (profileUpdate.error) {
      return { data: null, error: profileUpdate.error.message };
    }

    const adminInsert = await supabase.from("admins").upsert(
      {
        clerk_user_id: clerkUserId,
        seller_profile_id: sellerProfileId,
        promoted_by_admin_id: promotedByAdminId,
      },
      { onConflict: "clerk_user_id" },
    );

    if (adminInsert.error) {
      return { data: null, error: adminInsert.error.message };
    }

    return { data: profileUpdate.data as SellerProfile, error: null };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}

export async function updateSellerVerificationStatus(
  sellerProfileId: string,
  status: SellerVerificationStatus,
) {
  try {
    const { data, error } = await supabase
      .from("seller_profiles")
      .update({ verification_status: status })
      .eq("id", sellerProfileId)
      .select("*")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as SellerProfile, error: null };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}
