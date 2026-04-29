import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useClerk, useUser } from "@clerk/react";
import {
  AlertTriangle,
  BadgeCheck,
  Ban,
  Crown,
  LayoutDashboard,
  LoaderCircle,
  Logs,
  LogOut,
  Phone,
  Settings,
  ShieldCheck,
  Store,
  UserCog,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  getSellerProfilesWithCounts,
  blockSellerProfile,
  createSellerProfilePlaceholder,
  promoteSellerProfileToAdmin,
  updateSellerVerificationStatus,
  type SellerProfileWithCount,
} from "@/lib/sellerProfiles";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { deleteProductListing, getProductListings, type ProductListing } from "@/lib/productListings";
import { getSiteSettings, saveSiteSettings, type SiteSettings } from "@/lib/siteSettings";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal | Artisans Market" },
      {
        name: "description",
        content: "Manage seller profiles, verification documents, blocking, and admin roles.",
      },
    ],
  }),
  component: AdminPortalPage,
});

type AdminSection = "dashboard" | "accounts" | "listings" | "site" | "audit";

interface AdminAuditEvent {
  id: string;
  createdAt: string;
  action: string;
  detail: string;
}

const ADMIN_AUDIT_KEY = "artisan-echo-admin-audit";

function readAuditEvents(): AdminAuditEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ADMIN_AUDIT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AdminAuditEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAuditEvents(events: AdminAuditEvent[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_AUDIT_KEY, JSON.stringify(events));
}

function AdminPortalPage() {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { isSignedIn, user } = useUser();
  const { isAdmin, loading: adminLoading } = useAdminAccess(isSignedIn ? user?.id : undefined, user?.primaryEmailAddress?.emailAddress);
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [sellers, setSellers] = useState<SellerProfileWithCount[]>([]);
  const [products, setProducts] = useState<ProductListing[]>([]);
  const [pageError, setPageError] = useState<string | null>(null);
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(getSiteSettings());
  const [auditEvents, setAuditEvents] = useState<AdminAuditEvent[]>(readAuditEvents());

  function logAudit(action: string, detail: string) {
    const event: AdminAuditEvent = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      action,
      detail,
    };
    const next = [event, ...readAuditEvents()].slice(0, 200);
    writeAuditEvents(next);
    setAuditEvents(next);
  }

  async function loadPortalData() {
    const [sellerResult, productResult] = await Promise.all([
      getSellerProfilesWithCounts(),
      getProductListings(),
    ]);

    setSellers(sellerResult.data ?? []);
    setProducts(productResult.data ?? []);
    setPageError(sellerResult.error ?? productResult.error);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadSellers() {
      if (!isAdmin) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      await loadPortalData();

      if (!isMounted) return;
      setLoading(false);
    }

    loadSellers();

    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  const sortedSellers = useMemo(
    () => [...sellers].sort((a, b) => Number(b.role === "admin") - Number(a.role === "admin")),
    [sellers],
  );

  const sellerDisplayNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const seller of sellers) {
      map.set(
        seller.clerk_user_id,
        seller.has_profile ? seller.full_name : `Seller ${seller.clerk_user_id.slice(0, 8)}`,
      );
    }
    return map;
  }, [sellers]);

  const groupedListings = useMemo(() => {
    const groups = new Map<
      string,
      {
        sellerId: string;
        sellerName: string;
        products: ProductListing[];
      }
    >();

    for (const product of products) {
      const sellerId = product.seller_id;
      const sellerName =
        sellerDisplayNameMap.get(sellerId) ?? `Seller ${sellerId.slice(0, 8)}`;

      if (!groups.has(sellerId)) {
        groups.set(sellerId, {
          sellerId,
          sellerName,
          products: [],
        });
      }

      groups.get(sellerId)!.products.push(product);
    }

    return [...groups.values()].sort((a, b) => a.sellerName.localeCompare(b.sellerName));
  }, [products, sellerDisplayNameMap]);

  async function refreshSellers() {
    await loadPortalData();
  }

  async function handleBlockToggle(profile: SellerProfileWithCount, shouldBlock: boolean) {
    if (!user) return;

    const reason = shouldBlock ? window.prompt(`Enter a block reason for ${profile.full_name}:`) ?? "" : "";

    setSavingId(profile.id);
    const result = await blockSellerProfile(profile.id, user.id, shouldBlock, reason);
    setSavingId(null);

    if (!result.data) {
      toast.error(result.error ?? "Unable to update seller status.");
      return;
    }

    logAudit(shouldBlock ? "block_seller" : "unblock_seller", `${profile.full_name} (${profile.clerk_user_id})`);
    toast.success(shouldBlock ? "Seller blocked." : "Seller unblocked.");
    await refreshSellers();
  }

  async function handlePromote(profile: SellerProfileWithCount) {
    if (!user) return;

    setSavingId(profile.id);
    const result = await promoteSellerProfileToAdmin(profile.id, profile.clerk_user_id, user.id);
    setSavingId(null);

    if (!result.data) {
      toast.error(result.error ?? "Unable to promote seller.");
      return;
    }

    logAudit("promote_admin", `${profile.full_name} (${profile.clerk_user_id})`);
    toast.success(`${profile.full_name} is now an admin.`);
    await refreshSellers();
  }

  async function handleVerification(profile: SellerProfileWithCount, status: "verified" | "rejected") {
    if (!profile.has_profile) {
      toast.error("Create the seller profile record first.");
      return;
    }

    setSavingId(profile.id);
    const result = await updateSellerVerificationStatus(profile.id, status);
    setSavingId(null);

    if (!result.data) {
      toast.error(result.error ?? "Unable to update verification status.");
      return;
    }

    logAudit("verification_update", `${profile.full_name} -> ${status}`);
    toast.success(`Seller marked as ${status}.`);
    await refreshSellers();
  }

  async function handleDeleteProduct(product: ProductListing) {
    if (!user) return;
    setSavingId(product.id);
    const result = await deleteProductListing(product.id, user.id);
    setSavingId(null);

    if (!result.ok) {
      toast.error(result.error ?? "Unable to remove product.");
      return;
    }

    logAudit("delete_product", `${product.name} (${product.id})`);
    toast.success("Product removed.");
    await refreshSellers();
  }

  async function handleInitializeProfile(profile: SellerProfileWithCount) {
    setSavingId(profile.id);
    const result = await createSellerProfilePlaceholder(
      profile.clerk_user_id,
      profile.latest_contact_number ?? profile.phone_number,
    );
    setSavingId(null);

    if (!result.data) {
      toast.error(result.error ?? "Unable to initialize seller profile.");
      return;
    }

    logAudit("create_seller_profile", `${profile.clerk_user_id}`);
    toast.success("Seller profile created. You can now manage this account.");
    await refreshSellers();
  }

  function handleSaveSettings() {
    saveSiteSettings(settingsForm);
    window.dispatchEvent(new Event("site-settings-updated"));
    logAudit("site_settings_update", "Updated hero and contact settings");
    toast.success("Site settings updated.");
  }

  const statCards = [
    { label: "Admins", value: sortedSellers.filter((seller) => seller.role === "admin").length, icon: Crown, color: "bg-[#ce7b3b]" },
    { label: "Sellers", value: sortedSellers.filter((seller) => seller.role === "seller").length, icon: UserCog, color: "bg-[#ce7b3b]" },
    { label: "Blocked", value: sortedSellers.filter((seller) => seller.is_blocked).length, icon: Ban, color: "bg-red-600" },
    { label: "Products", value: products.length, icon: Store, color: "bg-emerald-600" },
  ];

  const sideMenu: Array<{ key: AdminSection; label: string; icon: typeof LayoutDashboard }> = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "accounts", label: "Manage Accounts", icon: UserCog },
    { key: "listings", label: "Listings", icon: Store },
    { key: "site", label: "Site Controls", icon: Settings },
    { key: "audit", label: "Audit Logs", icon: Logs },
  ];

  if (!isSignedIn) {
    return (
      <section className="min-h-screen bg-bg-warm px-6 py-20 md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <Card className="border border-card-warm-border bg-card-warm p-8 md:p-10">
            <h1 className="font-display text-3xl text-foreground">Sign in to open the admin portal</h1>
            <p className="mt-3 text-sm leading-[1.8] text-text-muted-warm">
              The admin portal is restricted to approved admin accounts.
            </p>
            <Button className="mt-6 bg-accent-amber hover:bg-accent-amber-hover text-white" onClick={() => navigate({ to: "/" })}>
              Go back home
            </Button>
          </Card>
        </div>
      </section>
    );
  }

  if (adminLoading || loading) {
    return (
      <section className="min-h-screen bg-bg-warm px-6 py-20 md:px-12">
        <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-xl border border-card-warm-border bg-card-warm p-6 text-text-muted-warm">
          <LoaderCircle className="h-5 w-5 animate-spin text-accent-amber" />
          Loading admin portal...
        </div>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="min-h-screen bg-bg-warm px-6 py-20 md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <Card className="border border-card-warm-border bg-card-warm p-8 md:p-10">
            <AlertTriangle className="mx-auto h-8 w-8 text-accent-amber" />
            <h1 className="mt-4 font-display text-3xl text-foreground">Unauthorized</h1>
            <p className="mt-3 text-sm leading-[1.8] text-text-muted-warm">
              Your account is not registered as an admin yet.
            </p>
            <Button className="mt-6 bg-accent-amber hover:bg-accent-amber-hover text-white" onClick={() => navigate({ to: "/" })}>
              Back to home
            </Button>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-100">
      <div className="mx-auto grid min-h-screen max-w-[1450px] lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-slate-200 bg-white px-3 py-6">
          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Administration</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">Control Center</h2>
          </div>
          <nav className="space-y-1">
            {sideMenu.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveSection(item.key)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                    active ? "bg-[#ce7b3b] text-white" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            Signed in as
            <div className="mt-1 font-semibold text-slate-900">{user?.primaryEmailAddress?.emailAddress ?? user?.id}</div>
          </div>
          <Button
            type="button"
            className="mt-4 w-full bg-[#ce7b3b] hover:bg-[#b96f35] text-white"
            onClick={() => signOut({ redirectUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </aside>

        <main className="px-5 py-8 md:px-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Administration Dashboard</h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage sellers, listings, verification, and website content from one place.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={() => navigate({ to: "/" })}>
              Back to Home
            </Button>
          </div>

          {pageError && (
            <Card className="mb-6 border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {pageError}
            </Card>
          )}

          {activeSection === "dashboard" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <Card key={card.label} className="border border-slate-200 bg-white p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-slate-500">{card.label}</p>
                          <p className="mt-1 text-4xl font-semibold text-slate-900">{card.value}</p>
                        </div>
                        <div className={`rounded-xl p-2 text-white ${card.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <Card className="border border-slate-200 bg-white p-5">
                <h2 className="text-lg font-semibold text-slate-900">Role Model</h2>
                <p className="mt-2 text-sm leading-[1.8] text-slate-600">
                  Admin can verify/reject seller identities, block seller accounts, promote trusted
                  sellers to admin, remove listings, and update homepage content.
                </p>
              </Card>
            </div>
          )}

          {activeSection === "accounts" && (
            <div className="grid gap-5 xl:grid-cols-2">
              {sortedSellers.map((seller) => (
                <Card key={seller.id} className="border border-slate-200 bg-white">
                  <div className="border-b border-slate-200 px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-xl font-semibold text-slate-900">{seller.full_name}</h3>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-slate-700">
                        {seller.role}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{seller.phone_number}</p>
                  </div>

                  <div className="space-y-3 p-4">
                    <p className="text-sm text-slate-700"><strong>Address:</strong> {seller.address}</p>
                    <p className="text-sm text-slate-700"><strong>Gov ID:</strong> {seller.government_id_type} ({seller.government_id_number})</p>
                    <p className="text-sm text-slate-700"><strong>Products listed:</strong> {seller.product_count}</p>
                    <p className="text-sm text-slate-700"><strong>Verification:</strong> {seller.verification_status}</p>
                    <p className="text-sm text-slate-700"><strong>Status:</strong> {seller.is_blocked ? "Blocked" : "Active"}</p>
                    <p className="text-sm text-slate-700"><strong>Seller ID:</strong> {seller.clerk_user_id}</p>

                    {!seller.has_profile && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                        This seller has listings but has not completed onboarding profile details yet.
                      </div>
                    )}

                    <div className="grid gap-2 sm:grid-cols-2">
                      {!seller.has_profile ? (
                        <Button
                          type="button"
                          className="sm:col-span-2 bg-[#ce7b3b] hover:bg-[#b96f35] text-white"
                          onClick={() => handleInitializeProfile(seller)}
                          disabled={savingId === seller.id}
                        >
                          {savingId === seller.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UserCog className="h-4 w-4" />}
                          Create Profile Record
                        </Button>
                      ) : null}

                      <Button type="button" variant="outline" onClick={() => handleVerification(seller, "verified")} disabled={savingId === seller.id}>
                        <BadgeCheck className="h-4 w-4" />
                        Verify
                      </Button>
                      <Button type="button" variant="outline" onClick={() => handleVerification(seller, "rejected")} disabled={savingId === seller.id}>
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                      <Button type="button" variant="outline" onClick={() => handleBlockToggle(seller, !seller.is_blocked)} disabled={savingId === seller.id || !seller.has_profile}>
                        {seller.is_blocked ? <ShieldCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                        {seller.is_blocked ? "Unblock" : "Block"}
                      </Button>
                      <Button type="button" className="bg-[#ce7b3b] hover:bg-[#b96f35] text-white" onClick={() => handlePromote(seller)} disabled={savingId === seller.id || seller.role === "admin" || !seller.has_profile}>
                        <Crown className="h-4 w-4" />
                        Promote Admin
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeSection === "listings" && (
            <Card className="border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-slate-900">Marketplace Listings</h2>
              <p className="mt-1 text-sm text-slate-600">Admin can remove listings from here. Products are grouped by seller.</p>
              <div className="mt-4 space-y-4">
                {groupedListings.length === 0 && (
                  <p className="text-sm text-slate-500">No listings found.</p>
                )}

                {groupedListings.map((group) => (
                  <div key={group.sellerId} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{group.sellerName}</h3>
                        <p className="text-sm text-slate-600">Seller ID: {group.sellerId}</p>
                      </div>
                      <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 shadow-sm">
                        {group.products.length} products
                      </div>
                    </div>

                    <div className="space-y-3">
                      {group.products.map((product) => (
                        <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
                          <div>
                            <p className="font-medium text-slate-900">{product.name}</p>
                            <p className="text-sm text-slate-600">
                              Contact: {product.contact_number}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-emerald-700">
                              ₹{Number(product.price).toFixed(2)}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleDeleteProduct(product)}
                              disabled={savingId === product.id}
                            >
                              {savingId === product.id ? (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                              ) : (
                                <Ban className="h-4 w-4" />
                              )}
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeSection === "site" && (
            <Card className="border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-slate-900">Site Controls</h2>
              <p className="mt-1 text-sm text-slate-600">Update homepage hero and contact section content.</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-slate-700">Hero Badge</label>
                  <Input value={settingsForm.heroBadge} onChange={(event) => setSettingsForm((prev) => ({ ...prev, heroBadge: event.target.value }))} />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-700">Hero Title Line 1</label>
                  <Input value={settingsForm.heroTitleLine1} onChange={(event) => setSettingsForm((prev) => ({ ...prev, heroTitleLine1: event.target.value }))} />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-700">Hero Accent Word</label>
                  <Input value={settingsForm.heroTitleAccent} onChange={(event) => setSettingsForm((prev) => ({ ...prev, heroTitleAccent: event.target.value }))} />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-700">Contact Phone</label>
                  <Input value={settingsForm.contactPhone} onChange={(event) => setSettingsForm((prev) => ({ ...prev, contactPhone: event.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm text-slate-700">Contact Email</label>
                  <Input value={settingsForm.contactEmail} onChange={(event) => setSettingsForm((prev) => ({ ...prev, contactEmail: event.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm text-slate-700">Hero Description</label>
                  <Textarea rows={4} value={settingsForm.heroDescription} onChange={(event) => setSettingsForm((prev) => ({ ...prev, heroDescription: event.target.value }))} />
                </div>
              </div>
              <div className="mt-4">
                <Button type="button" className="bg-[#ce7b3b] hover:bg-[#b96f35] text-white" onClick={handleSaveSettings}>
                  <Phone className="h-4 w-4" />
                  Save Site Settings
                </Button>
              </div>
            </Card>
          )}

          {activeSection === "audit" && (
            <Card className="border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-slate-900">Audit Logs</h2>
              <p className="mt-1 text-sm text-slate-600">Recent admin actions from this dashboard.</p>
              <div className="mt-4 space-y-2">
                {auditEvents.length === 0 && <p className="text-sm text-slate-500">No actions yet.</p>}
                {auditEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border border-slate-200 px-3 py-2">
                    <p className="text-sm font-medium text-slate-900">{event.action}</p>
                    <p className="text-sm text-slate-600">{event.detail}</p>
                    <p className="text-xs text-slate-500">{new Date(event.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </main>
      </div>
    </section>
  );
}
