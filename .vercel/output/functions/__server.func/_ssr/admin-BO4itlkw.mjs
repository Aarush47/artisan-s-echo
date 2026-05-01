import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import "../_libs/clerk__react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as Card, B as Button, c as createSellerProfilePlaceholder, a as updateSellerVerificationStatus, b as blockSellerProfile, p as promoteSellerProfileToAdmin, d as getSellerProfilesWithCounts } from "./sellerProfiles-zPqAJo-P.mjs";
import { I as Input, T as Textarea } from "./textarea-B-EZTJgr.mjs";
import { u as useAdminAccess, g as getSiteSettings, s as saveSiteSettings } from "./siteSettings-BuVJKTDt.mjs";
import { d as deleteProductListing, g as getProductListings } from "./productListings-BR6yt-vM.mjs";
import { p as useClerk, o as useUser } from "../_libs/clerk__shared.mjs";
import { C as Crown, a as UserCog, b as Ban, S as Store, L as LoaderCircle, T as TriangleAlert, c as LayoutDashboard, d as Settings, e as Logs, f as LogOut, B as BadgeCheck, g as CircleX, h as ShieldCheck, P as Phone } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/scheduler.mjs";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./router-DA9ch3Vk.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/dequal.mjs";
const ADMIN_AUDIT_KEY = "artisan-echo-admin-audit";
function readAuditEvents() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ADMIN_AUDIT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function writeAuditEvents(events) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_AUDIT_KEY, JSON.stringify(events));
}
function AdminPortalPage() {
  const navigate = useNavigate();
  const {
    signOut
  } = useClerk();
  const {
    isSignedIn,
    user
  } = useUser();
  const {
    isAdmin,
    loading: adminLoading
  } = useAdminAccess(isSignedIn ? user?.id : void 0, user?.primaryEmailAddress?.emailAddress);
  const [activeSection, setActiveSection] = reactExports.useState("dashboard");
  const [loading, setLoading] = reactExports.useState(true);
  const [savingId, setSavingId] = reactExports.useState(null);
  const [sellers, setSellers] = reactExports.useState([]);
  const [products, setProducts] = reactExports.useState([]);
  const [pageError, setPageError] = reactExports.useState(null);
  const [settingsForm, setSettingsForm] = reactExports.useState(getSiteSettings());
  const [auditEvents, setAuditEvents] = reactExports.useState(readAuditEvents());
  function logAudit(action, detail) {
    const event = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      action,
      detail
    };
    const next = [event, ...readAuditEvents()].slice(0, 200);
    writeAuditEvents(next);
    setAuditEvents(next);
  }
  async function loadPortalData() {
    const [sellerResult, productResult] = await Promise.all([getSellerProfilesWithCounts(), getProductListings()]);
    setSellers(sellerResult.data ?? []);
    setProducts(productResult.data ?? []);
    setPageError(sellerResult.error ?? productResult.error);
  }
  reactExports.useEffect(() => {
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
  const sortedSellers = reactExports.useMemo(() => [...sellers].sort((a, b) => Number(b.role === "admin") - Number(a.role === "admin")), [sellers]);
  const sellerDisplayNameMap = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const seller of sellers) {
      map.set(seller.clerk_user_id, seller.has_profile ? seller.full_name : `Seller ${seller.clerk_user_id.slice(0, 8)}`);
    }
    return map;
  }, [sellers]);
  const groupedListings = reactExports.useMemo(() => {
    const groups = /* @__PURE__ */ new Map();
    for (const product of products) {
      const sellerId = product.seller_id;
      const sellerName = sellerDisplayNameMap.get(sellerId) ?? `Seller ${sellerId.slice(0, 8)}`;
      if (!groups.has(sellerId)) {
        groups.set(sellerId, {
          sellerId,
          sellerName,
          products: []
        });
      }
      groups.get(sellerId).products.push(product);
    }
    return [...groups.values()].sort((a, b) => a.sellerName.localeCompare(b.sellerName));
  }, [products, sellerDisplayNameMap]);
  async function refreshSellers() {
    await loadPortalData();
  }
  async function handleBlockToggle(profile, shouldBlock) {
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
  async function handlePromote(profile) {
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
  async function handleVerification(profile, status) {
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
  async function handleDeleteProduct(product) {
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
  async function handleInitializeProfile(profile) {
    setSavingId(profile.id);
    const result = await createSellerProfilePlaceholder(profile.clerk_user_id, profile.latest_contact_number ?? profile.phone_number);
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
  const statCards = [{
    label: "Admins",
    value: sortedSellers.filter((seller) => seller.role === "admin").length,
    icon: Crown,
    color: "bg-[#ce7b3b]"
  }, {
    label: "Sellers",
    value: sortedSellers.filter((seller) => seller.role === "seller").length,
    icon: UserCog,
    color: "bg-[#ce7b3b]"
  }, {
    label: "Blocked",
    value: sortedSellers.filter((seller) => seller.is_blocked).length,
    icon: Ban,
    color: "bg-red-600"
  }, {
    label: "Products",
    value: products.length,
    icon: Store,
    color: "bg-emerald-600"
  }];
  const sideMenu = [{
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard
  }, {
    key: "accounts",
    label: "Manage Accounts",
    icon: UserCog
  }, {
    key: "listings",
    label: "Listings",
    icon: Store
  }, {
    key: "site",
    label: "Site Controls",
    icon: Settings
  }, {
    key: "audit",
    label: "Audit Logs",
    icon: Logs
  }];
  if (!isSignedIn) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "min-h-screen bg-bg-warm px-6 py-20 md:px-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-card-warm-border bg-card-warm p-8 md:p-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl text-foreground", children: "Sign in to open the admin portal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-[1.8] text-text-muted-warm", children: "The admin portal is restricted to approved admin accounts." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-6 bg-accent-amber hover:bg-accent-amber-hover text-white", onClick: () => navigate({
        to: "/"
      }), children: "Go back home" })
    ] }) }) });
  }
  if (adminLoading || loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "min-h-screen bg-bg-warm px-6 py-20 md:px-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-3xl items-center gap-3 rounded-xl border border-card-warm-border bg-card-warm p-6 text-text-muted-warm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-accent-amber" }),
      "Loading admin portal..."
    ] }) });
  }
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "min-h-screen bg-bg-warm px-6 py-20 md:px-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-card-warm-border bg-card-warm p-8 md:p-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mx-auto h-8 w-8 text-accent-amber" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-display text-3xl text-foreground", children: "Unauthorized" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-[1.8] text-text-muted-warm", children: "Your account is not registered as an admin yet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-6 bg-accent-amber hover:bg-accent-amber-hover text-white", onClick: () => navigate({
        to: "/"
      }), children: "Back to home" })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "min-h-screen bg-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid min-h-screen max-w-[1450px] lg:grid-cols-[280px_1fr]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "border-r border-slate-200 bg-white px-3 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.14em] text-slate-500", children: "Administration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 text-lg font-semibold text-slate-900", children: "Control Center" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "space-y-1", children: sideMenu.map((item) => {
        const Icon = item.icon;
        const active = activeSection === item.key;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setActiveSection(item.key), className: `w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${active ? "bg-[#ce7b3b] text-white" : "text-slate-700 hover:bg-slate-100"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
          item.label
        ] }) }, item.key);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600", children: [
        "Signed in as",
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-semibold text-slate-900", children: user?.primaryEmailAddress?.emailAddress ?? user?.id })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", className: "mt-4 w-full bg-[#ce7b3b] hover:bg-[#b96f35] text-white", onClick: () => signOut({
        redirectUrl: "/"
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
        "Logout"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "px-5 py-8 md:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-semibold tracking-tight text-slate-900", children: "Administration Dashboard" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-600", children: "Manage sellers, listings, verification, and website content from one place." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => navigate({
          to: "/"
        }), children: "Back to Home" })
      ] }),
      pageError && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mb-6 border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900", children: pageError }),
      activeSection === "dashboard" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: statCards.map((card) => {
          const Icon = card.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border border-slate-200 bg-white p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: card.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-4xl font-semibold text-slate-900", children: card.value })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-xl p-2 text-white ${card.color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) })
          ] }) }, card.label);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-slate-200 bg-white p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "Role Model" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-[1.8] text-slate-600", children: "Admin can verify/reject seller identities, block seller accounts, promote trusted sellers to admin, remove listings, and update homepage content." })
        ] })
      ] }),
      activeSection === "accounts" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5 xl:grid-cols-2", children: sortedSellers.map((seller) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-slate-200 bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-slate-200 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-slate-900", children: seller.full_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-slate-700", children: seller.role })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-600", children: seller.phone_number })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Address:" }),
            " ",
            seller.address
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Gov ID:" }),
            " ",
            seller.government_id_type,
            " (",
            seller.government_id_number,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Products listed:" }),
            " ",
            seller.product_count
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Verification:" }),
            " ",
            seller.verification_status
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Status:" }),
            " ",
            seller.is_blocked ? "Blocked" : "Active"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Seller ID:" }),
            " ",
            seller.clerk_user_id
          ] }),
          !seller.has_profile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900", children: "This seller has listings but has not completed onboarding profile details yet." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [
            !seller.has_profile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", className: "sm:col-span-2 bg-[#ce7b3b] hover:bg-[#b96f35] text-white", onClick: () => handleInitializeProfile(seller), disabled: savingId === seller.id, children: [
              savingId === seller.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "h-4 w-4" }),
              "Create Profile Record"
            ] }) : null,
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", onClick: () => handleVerification(seller, "verified"), disabled: savingId === seller.id, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-4 w-4" }),
              "Verify"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", onClick: () => handleVerification(seller, "rejected"), disabled: savingId === seller.id, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }),
              "Reject"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", onClick: () => handleBlockToggle(seller, !seller.is_blocked), disabled: savingId === seller.id || !seller.has_profile, children: [
              seller.is_blocked ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "h-4 w-4" }),
              seller.is_blocked ? "Unblock" : "Block"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", className: "bg-[#ce7b3b] hover:bg-[#b96f35] text-white", onClick: () => handlePromote(seller), disabled: savingId === seller.id || seller.role === "admin" || !seller.has_profile, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-4 w-4" }),
              "Promote Admin"
            ] })
          ] })
        ] })
      ] }, seller.id)) }),
      activeSection === "listings" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-slate-200 bg-white p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "Marketplace Listings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-600", children: "Admin can remove listings from here. Products are grouped by seller." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-4", children: [
          groupedListings.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "No listings found." }),
          groupedListings.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex flex-wrap items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-slate-900", children: group.sellerName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600", children: [
                  "Seller ID: ",
                  group.sellerId
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 shadow-sm", children: [
                group.products.length,
                " products"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: group.products.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-900", children: product.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600", children: [
                  "Contact: ",
                  product.contact_number
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-emerald-700", children: [
                  "₹",
                  Number(product.price).toFixed(2)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", onClick: () => handleDeleteProduct(product), disabled: savingId === product.id, children: [
                  savingId === product.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "h-4 w-4" }),
                  "Remove"
                ] })
              ] })
            ] }, product.id)) })
          ] }, group.sellerId))
        ] })
      ] }),
      activeSection === "site" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-slate-200 bg-white p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "Site Controls" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-600", children: "Update homepage hero and contact section content." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-sm text-slate-700", children: "Hero Badge" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: settingsForm.heroBadge, onChange: (event) => setSettingsForm((prev) => ({
              ...prev,
              heroBadge: event.target.value
            })) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-sm text-slate-700", children: "Hero Title Line 1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: settingsForm.heroTitleLine1, onChange: (event) => setSettingsForm((prev) => ({
              ...prev,
              heroTitleLine1: event.target.value
            })) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-sm text-slate-700", children: "Hero Accent Word" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: settingsForm.heroTitleAccent, onChange: (event) => setSettingsForm((prev) => ({
              ...prev,
              heroTitleAccent: event.target.value
            })) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-sm text-slate-700", children: "Contact Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: settingsForm.contactPhone, onChange: (event) => setSettingsForm((prev) => ({
              ...prev,
              contactPhone: event.target.value
            })) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-sm text-slate-700", children: "Contact Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: settingsForm.contactEmail, onChange: (event) => setSettingsForm((prev) => ({
              ...prev,
              contactEmail: event.target.value
            })) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-sm text-slate-700", children: "Hero Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: settingsForm.heroDescription, onChange: (event) => setSettingsForm((prev) => ({
              ...prev,
              heroDescription: event.target.value
            })) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", className: "bg-[#ce7b3b] hover:bg-[#b96f35] text-white", onClick: handleSaveSettings, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
          "Save Site Settings"
        ] }) })
      ] }),
      activeSection === "audit" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-slate-200 bg-white p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "Audit Logs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-600", children: "Recent admin actions from this dashboard." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
          auditEvents.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "No actions yet." }),
          auditEvents.map((event) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-slate-200 px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-900", children: event.action }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600", children: event.detail }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: new Date(event.createdAt).toLocaleString() })
          ] }, event.id))
        ] })
      ] })
    ] })
  ] }) });
}
export {
  AdminPortalPage as component
};
