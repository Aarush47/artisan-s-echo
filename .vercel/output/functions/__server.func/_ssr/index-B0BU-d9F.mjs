import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { U as UserButton, S as SignInButton, a as SignUpButton } from "../_libs/clerk__react.mjs";
import { g as gsapWithCSS, S as ScrollTrigger } from "../_libs/gsap.mjs";
import { u as useAdminAccess, g as getSiteSettings } from "./siteSettings-QC2hHKUO.mjs";
import { i as isAllowedAdminEmail, C as Card, B as Button, g as getSellerProfile } from "./sellerProfiles-DEIg_NqB.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { g as getProductListings, d as deleteProductListing, c as createProductListing } from "./productListings-Cm6pTa2-.mjs";
import { I as Input, T as Textarea } from "./textarea-Cvkv0hm0.mjs";
import { L as Label } from "./label-CjOLDDtG.mjs";
import { o as useUser, p as useClerk } from "../_libs/clerk__shared.mjs";
import { f as LogOut, X, M as Menu, S as Store, P as Phone, L as LoaderCircle, i as Trash2, j as Sparkles, I as ImagePlus, k as LayoutGrid, F as Flower2, C as Crown, l as CircleDot, m as Minus, n as Plus, o as Mail } from "../_libs/lucide-react.mjs";
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
import "./router-DkzG_Dwk.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
if (typeof window !== "undefined") {
  gsapWithCSS.registerPlugin(ScrollTrigger);
}
const links = [
  { label: "Marketplace", href: "#marketplace" },
  { label: "About", href: "#about" },
  { label: "Our Range", href: "#our-range" },
  { label: "Contact", href: "#contact" }
];
function Navbar() {
  const linksRef = reactExports.useRef(null);
  const [open, setOpen] = reactExports.useState(false);
  const { signOut } = useClerk();
  const { isSignedIn, user } = useUser();
  const { isAdmin } = useAdminAccess(isSignedIn ? user?.id : void 0, user?.primaryEmailAddress?.emailAddress);
  const navLinks = isSignedIn ? [
    ...links,
    ...isAdmin || isAllowedAdminEmail(user?.primaryEmailAddress?.emailAddress) ? [{ label: "Admin Portal", href: "/admin" }] : [],
    { label: "Sell Your Craft", href: "#sell" }
  ] : links;
  reactExports.useEffect(() => {
    if (!linksRef.current) return;
    gsapWithCSS.from(linksRef.current.children, {
      y: -8,
      opacity: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: "power2.out"
    });
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "fixed top-0 left-0 right-0 z-50 h-[52px] bg-nav-bg backdrop-blur-md border-b border-black/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full px-6 md:px-12 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-bold text-foreground", children: "Artisans Market" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:block w-px h-4 bg-foreground/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:block text-[10px] uppercase tracking-[0.18em] text-text-muted-warm", children: "Handmade marketplace" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { ref: linksRef, className: "hidden md:flex items-center gap-8", children: navLinks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: l.href,
          className: "text-[11px] uppercase tracking-[0.12em] font-medium text-foreground hover:text-accent-amber transition-colors",
          children: l.label
        },
        l.label
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        isSignedIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserButton, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => signOut({ redirectUrl: "/" }),
              className: "inline-flex items-center gap-2 rounded-md border border-foreground px-4 py-1.5 text-[10px] uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-foreground hover:text-text-light",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3.5 w-3.5" }),
                "Logout"
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SignInButton, { mode: "modal", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "border border-foreground px-4 py-1.5 text-[10px] uppercase tracking-[0.12em] hover:bg-foreground hover:text-text-light transition-colors", children: "Sign In" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SignUpButton, { mode: "modal", forceRedirectUrl: "/seller-onboarding", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-foreground text-text-light px-4 py-1.5 text-[10px] uppercase tracking-[0.12em] hover:bg-foreground/90 transition-colors", children: "Sign Up" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "md:hidden p-2",
            onClick: () => setOpen(!open),
            "aria-label": "Toggle menu",
            children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { size: 20 })
          }
        )
      ] })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden bg-nav-bg backdrop-blur-md border-b border-black/10 px-6 py-4 flex flex-col gap-3", children: [
      navLinks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: l.href,
          onClick: () => setOpen(false),
          className: "text-[11px] uppercase tracking-[0.12em] font-medium text-foreground",
          children: l.label
        },
        l.label
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 mt-2 flex-col sm:flex-row", children: isSignedIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserButton, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => signOut({ redirectUrl: "/" }),
            className: "inline-flex items-center justify-center gap-2 rounded-md border border-foreground px-4 py-2 text-[10px] uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-foreground hover:text-text-light",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3.5 w-3.5" }),
              "Logout"
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SignInButton, { mode: "modal", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "flex-1 border border-foreground px-4 py-1.5 text-[10px] uppercase tracking-[0.12em] hover:bg-foreground hover:text-text-light transition-colors", children: "Sign In" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SignUpButton, { mode: "modal", forceRedirectUrl: "/seller-onboarding", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "flex-1 bg-foreground text-text-light px-4 py-1.5 text-[10px] uppercase tracking-[0.12em] hover:bg-foreground/90 transition-colors", children: "Sign Up" }) })
      ] }) })
    ] })
  ] });
}
const heroBg = "/assets/hero-bg-sogqDbfl.jpg";
function Hero() {
  const textRef = reactExports.useRef(null);
  const [settings, setSettings] = reactExports.useState(getSiteSettings());
  reactExports.useEffect(() => {
    const refresh = () => {
      setSettings(getSiteSettings());
    };
    window.addEventListener("storage", refresh);
    window.addEventListener("site-settings-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("site-settings-updated", refresh);
    };
  }, []);
  reactExports.useEffect(() => {
    const tl = gsapWithCSS.timeline();
    if (textRef.current) {
      tl.from(textRef.current.children, {
        x: -30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out"
      });
    }
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative w-full h-[480px] sm:h-[550px] md:h-[640px] overflow-hidden mt-[52px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: heroBg,
        alt: "Handcrafted wooden bowls",
        className: "absolute inset-0 w-full h-full object-cover",
        width: 1920,
        height: 1024
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0",
        style: {
          background: "linear-gradient(to right, oklch(0.18 0.018 60 / 0.8) 40%, oklch(0.18 0.018 60 / 0.15) 100%)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: textRef,
        className: "absolute left-4 sm:left-6 md:left-16 bottom-8 sm:bottom-12 md:bottom-24 max-w-md text-text-light",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-white/70 mb-2 sm:mb-3", children: settings.heroBadge }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-4xl sm:text-5xl md:text-[64px] leading-[1.05] text-white", children: [
            settings.heroTitleLine1,
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "with ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-accent-amber", children: settings.heroTitleAccent })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body font-light text-[12px] sm:text-[13px] text-white/75 leading-[1.7] mt-3 sm:mt-5 max-w-sm", children: settings.heroDescription }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mt-5 sm:mt-7 bg-accent-amber hover:bg-accent-amber-hover text-white px-6 sm:px-7 py-2.5 sm:py-3 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5", children: "Shop Now" })
        ]
      }
    )
  ] });
}
function MarketplaceSection({ refreshToken }) {
  const { isSignedIn, user } = useUser();
  const [listings, setListings] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [statusMessage, setStatusMessage] = reactExports.useState(null);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  reactExports.useEffect(() => {
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
  const hasListings = reactExports.useMemo(() => listings.length > 0, [listings.length]);
  async function handleDelete(item) {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "marketplace", className: "bg-bg-warm px-6 md:px-12 py-16 md:py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end justify-between gap-4 mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[20px] md:text-[20px] font-bold uppercase tracking-[0.2em] text-foreground", children: "Marketplace" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl md:text-2xl leading-[1.15] text-foreground mt-2", children: "Explore and contact sellers directly." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm md:text-base text-text-muted-warm mt-4 max-w-2xl leading-[1.8]", children: "When you want to buy a product, open the listing and use the contact number shown below each item." })
    ] }) }),
    statusMessage && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mb-6 border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900", children: statusMessage }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: Array.from({ length: 3 }).map((_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "h-80 animate-pulse bg-muted" }, idx)) }) : !hasListings ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-8 text-center border border-card-warm-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-amber/10 text-accent-amber", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl text-foreground", children: "No products listed yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-text-muted-warm", children: "Ask a seller to add their first product using the sell form." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: listings.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden border border-card-warm-border bg-card-warm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-56 bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: item.image_url,
          alt: item.name,
          className: "w-full h-full object-cover",
          loading: "lazy"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl text-foreground leading-tight", children: item.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-semibold text-accent-amber", children: [
            "₹",
            Number(item.price).toFixed(2)
          ] })
        ] }),
        item.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-[1.65] text-text-muted-warm", children: item.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-bg-warm px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.15em] text-text-muted-warm", children: "Seller contact number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-foreground mt-1", children: item.contact_number })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "w-full bg-accent-amber hover:bg-accent-amber-hover text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `tel:${item.contact_number.replace(/\s+/g, "")}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
          "Contact Seller"
        ] }) }),
        isSignedIn && user?.id === item.seller_id && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            className: "w-full",
            onClick: () => handleDelete(item),
            disabled: deletingId === item.id,
            children: deletingId === item.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
              "Removing"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
              "Remove Product"
            ] })
          }
        )
      ] })
    ] }, item.id)) })
  ] }) });
}
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
function SellProductSection({ onProductCreated }) {
  const { isSignedIn, user } = useUser();
  const [name, setName] = reactExports.useState("");
  const [price, setPrice] = reactExports.useState("");
  const [contactNumber, setContactNumber] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [imageFile, setImageFile] = reactExports.useState(null);
  const [imagePreview, setImagePreview] = reactExports.useState("");
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const [latestListing, setLatestListing] = reactExports.useState(null);
  const [sellerProfile, setSellerProfile] = reactExports.useState(null);
  const [profileLoading, setProfileLoading] = reactExports.useState(false);
  const [profileError, setProfileError] = reactExports.useState(null);
  reactExports.useEffect(() => {
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
  const canSubmit = reactExports.useMemo(() => {
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
  async function handleImageChange(event) {
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
  async function handleSubmit(event) {
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
        description: description.trim() || void 0,
        imageFile
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "sell", className: "bg-bg-warm px-6 md:px-12 py-16 md:py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 max-w-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.2em] text-text-muted-warm", children: "Sell your craft" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl md:text-5xl leading-[1.05] text-foreground", children: "Add a handmade product after you sign in." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm md:text-base text-text-muted-warm leading-[1.8]", children: "Signed-in users can list a product with a photo, name, price, contact number, and an optional description. The form saves directly to Supabase and keeps the experience inside the site." }),
      !isSignedIn ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6 bg-card-warm border border-card-warm-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 rounded-full bg-accent-amber/15 p-2 text-accent-amber", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl text-foreground", children: "Sign in to list products" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-text-muted-warm leading-[1.7]", children: "Create an account or sign in to start selling your handmade items." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SignInButton, { mode: "modal", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-foreground text-text-light px-4 py-2 text-[10px] uppercase tracking-[0.15em] hover:bg-foreground/90 transition-colors", children: "Sign In" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SignUpButton, { mode: "modal", forceRedirectUrl: "/seller-onboarding", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "border border-foreground px-4 py-2 text-[10px] uppercase tracking-[0.15em] hover:bg-foreground hover:text-text-light transition-colors", children: "Sign Up" }) })
          ] })
        ] })
      ] }) }) : profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6 bg-card-warm border border-card-warm-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-text-muted-warm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-accent-amber" }),
        "Checking seller profile..."
      ] }) }) : profileError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 bg-card-warm border border-card-warm-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl text-foreground", children: "Seller profile unavailable" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-text-muted-warm leading-[1.7]", children: profileError })
      ] }) : !sellerProfile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 bg-card-warm border border-card-warm-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl text-foreground", children: "Complete your seller profile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-text-muted-warm leading-[1.7]", children: "Add your name, photo, contact number, address, and verification documents before listing products." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            className: "mt-5 bg-accent-amber hover:bg-accent-amber-hover text-white",
            onClick: () => window.location.assign("/seller-onboarding"),
            children: "Complete Seller Profile"
          }
        )
      ] }) : sellerProfile.is_blocked ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 bg-card-warm border border-red-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl text-foreground", children: "Seller account blocked" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-text-muted-warm leading-[1.7]", children: sellerProfile.blocked_reason ?? "Your account has been blocked by an admin." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 bg-card-warm border border-card-warm-border shadow-[0_12px_40px_rgba(0,0,0,0.06)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] uppercase tracking-[0.18em] text-text-muted-warm mb-5", children: [
          "Signed in as ",
          user?.firstName ?? "seller"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-5", onSubmit: handleSubmit, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "product-name", children: "Product name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "product-name",
                value: name,
                onChange: (event) => setName(event.target.value),
                placeholder: "Handmade ceramic vase",
                maxLength: 100,
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "product-price", children: "Price" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "product-price",
                  type: "number",
                  min: "1",
                  step: "0.01",
                  value: price,
                  onChange: (event) => setPrice(event.target.value),
                  placeholder: "1499",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "contact-number", children: "Contact number" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "contact-number",
                  value: contactNumber,
                  onChange: (event) => setContactNumber(event.target.value),
                  placeholder: "9876543210",
                  inputMode: "tel",
                  maxLength: 20,
                  required: true
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "product-description", children: "Product description (optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "product-description",
                value: description,
                onChange: (event) => setDescription(event.target.value),
                placeholder: "Share details like size, material, finish, or care instructions",
                rows: 4,
                maxLength: 500
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "product-image", children: "Product photo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: "product-image",
                className: "flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-card-warm-border bg-bg-warm/60 px-4 py-6 text-center transition-colors hover:border-accent-amber hover:bg-accent-amber/5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "h-6 w-6 text-accent-amber" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: "Click to upload an image" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-text-muted-warm", children: "PNG, JPG, WebP up to 5MB" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "product-image",
                      type: "file",
                      accept: "image/*",
                      className: "hidden",
                      onChange: handleImageChange
                    }
                  )
                ]
              }
            )
          ] }),
          imagePreview && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-xl border border-card-warm-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: imagePreview,
              alt: "Product preview",
              className: "h-56 w-full object-cover"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: isSubmitting || !canSubmit,
              className: "w-full bg-accent-amber hover:bg-accent-amber-hover text-white",
              children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                "Saving product"
              ] }) : "Add Product"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:pt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden border border-card-warm-border bg-card-warm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-card-warm-border px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.18em] text-text-muted-warm", children: "Recent listing" }) }),
      latestListing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: latestListing.image_url,
            alt: latestListing.name,
            className: "h-72 w-full object-cover"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 px-6 py-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl text-foreground", children: latestListing.name }),
              latestListing.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm leading-[1.6] text-text-muted-warm", children: latestListing.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-text-muted-warm", children: [
                "Contact: ",
                latestListing.contact_number
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-semibold text-accent-amber", children: [
              "₹",
              Number(latestListing.price).toFixed(2)
            ] })
          ] }),
          user && latestListing.seller_id === user.id && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: handleRemoveLatest,
              disabled: isDeleting,
              variant: "outline",
              className: "w-full",
              children: isDeleting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                "Removing"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
                "Remove Product"
              ] })
            }
          )
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-96 items-center justify-center px-6 py-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-amber/10 text-accent-amber", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl text-foreground", children: "Your listing preview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-text-muted-warm leading-[1.7]", children: "After you submit the form, the latest product will appear here so you can confirm the image, price, and contact details." })
      ] }) })
    ] }) })
  ] }) });
}
const about = "/assets/about-craftsman-BLRjI7_L.jpg";
function AboutSection() {
  const leftRef = reactExports.useRef(null);
  const rightRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const ctx = gsapWithCSS.context(() => {
      gsapWithCSS.from(leftRef.current, {
        x: -40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: leftRef.current, start: "top 80%" }
      });
      gsapWithCSS.from(rightRef.current, {
        x: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: rightRef.current, start: "top 80%" }
      });
    });
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "about", className: "bg-bg-dark py-20 px-6 md:px-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: leftRef, className: "text-text-light", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-4xl md:text-[40px] leading-[1.15] text-white", children: [
        "About",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "Artisans Market"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 font-light text-[13px] text-white/70 leading-[1.8]", children: "Welcome to Artisans Market, where every product tells a story of skill, culture, and passion." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 font-light text-[13px] text-white/70 leading-[1.8]", children: "We connect talented creators with people who truly value handmade craftsmanship. Each piece is carefully selected to bring authenticity, beauty, and meaning into your life." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 font-light text-[13px] text-white/70 leading-[1.8]", children: "Shop with us and support artisans while discovering something truly unique." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mt-8 bg-accent-amber hover:bg-accent-amber-hover text-white px-7 py-3 text-[11px] uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5", children: "Explore Shop" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: rightRef, className: "md:translate-x-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: about,
        alt: "Craftsman painting elephant",
        loading: "lazy",
        className: "w-full h-[440px] object-cover shadow-[0_12px_48px_rgba(0,0,0,0.6)]"
      }
    ) })
  ] }) });
}
const items = [
  {
    icon: LayoutGrid,
    title: "Dinnerware",
    desc: "Discover our exquisite range of dinnerware that adds elegance to your table setting."
  },
  {
    icon: Flower2,
    title: "Decorative Vases",
    desc: "Elegance in Bloom — handcrafted vases that bring life to any space."
  },
  {
    icon: Crown,
    title: "Sculptures",
    desc: "Artistic Masterpieces — original sculptures crafted with skill and vision."
  },
  {
    icon: CircleDot,
    title: "Custom Orders",
    desc: "Get in touch for bespoke creations that reflect your style and personality."
  }
];
function OurRange() {
  const gridRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsapWithCSS.context(() => {
      gsapWithCSS.from(gridRef.current.children, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 85%" }
      });
    });
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "our-range", className: "bg-bg-warm py-16 md:py-20 px-6 md:px-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl md:text-4xl text-foreground", children: "Our Range" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "#",
          className: "text-[11px] uppercase tracking-[0.12em] text-text-muted-warm border-b border-text-muted-warm pb-0.5 hover:text-accent-amber hover:border-accent-amber transition-colors",
          children: "View More"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: gridRef, className: "mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5", children: items.map(({ icon: Icon, title, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card-warm border border-card-warm-border p-6 hover:shadow-md transition-shadow",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 28, className: "text-text-muted-warm", strokeWidth: 1.5 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-body font-semibold text-[14px] text-foreground", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 font-light text-[12px] text-text-muted-warm leading-[1.6]", children: desc })
        ]
      },
      title
    )) })
  ] });
}
const faqs = [
  {
    q: "Common Queries",
    a: "Find answers to our most frequently asked questions about our products and services."
  },
  {
    q: "Shipping & Delivery",
    a: "We offer nationwide shipping within 5–7 business days. Express options available at checkout."
  },
  {
    q: "Custom Orders",
    a: "Yes, we accept custom orders. Contact us with your requirements and we'll get back to you."
  },
  {
    q: "Care Instructions",
    a: "Most handcrafted items require gentle care. Avoid direct sunlight and harsh chemicals."
  }
];
function FAQ() {
  const [open, setOpen] = reactExports.useState(0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "faqs", className: "bg-faq-bg py-20 px-6 md:px-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl md:text-[36px] text-center text-foreground mb-12", children: "Frequently Asked Questions" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: faqs.map((f, i) => {
      const isOpen = open === i;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-black/15", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setOpen(isOpen ? null : i),
            className: "w-full py-5 flex items-center justify-between text-left",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body font-medium text-[14px] text-foreground", children: f.q }),
              isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 18, className: "text-text-muted-warm" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18, className: "text-text-muted-warm" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid transition-all duration-300 ease-out",
            style: { gridTemplateRows: isOpen ? "1fr" : "0fr" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pb-5 font-light text-[13px] text-text-muted-warm leading-[1.7]", children: f.a }) })
          }
        )
      ] }, f.q);
    }) })
  ] }) });
}
function ContactSection() {
  const formRef = reactExports.useRef(null);
  const [sent, setSent] = reactExports.useState(false);
  const [settings, setSettings] = reactExports.useState(getSiteSettings());
  const [formData, setFormData] = reactExports.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });
  reactExports.useEffect(() => {
    const refresh = () => {
      setSettings(getSiteSettings());
    };
    window.addEventListener("storage", refresh);
    window.addEventListener("site-settings-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("site-settings-updated", refresh);
    };
  }, []);
  reactExports.useEffect(() => {
    if (!formRef.current) return;
    const ctx = gsapWithCSS.context(() => {
      gsapWithCSS.from(formRef.current.querySelectorAll(".field"), {
        y: 15,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: formRef.current, start: "top 85%" }
      });
    });
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);
  const labelCls = "text-[10px] uppercase tracking-[0.12em] text-text-muted-warm mb-1.5 block";
  const inputCls = "w-full border border-input-border px-3 py-2.5 text-[13px] focus:border-accent-amber focus:outline-none bg-white";
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }
  function handleSubmit(event) {
    event.preventDefault();
    const subject = `New inquiry from ${formData.firstName} ${formData.lastName}`;
    const body = [
      `First Name: ${formData.firstName}`,
      `Last Name: ${formData.lastName}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone || "N/A"}`,
      "",
      "Message:",
      formData.message || "(No message provided)"
    ].join("\n");
    const mailtoUrl = `mailto:${settings.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    setSent(true);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: ""
    });
    setTimeout(() => setSent(false), 3e3);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "contact", className: "bg-white py-20 px-6 md:px-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 md:gap-12 max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl md:text-[36px] text-foreground", children: "Get in Touch" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 font-light text-[13px] text-text-muted-warm leading-[1.7] max-w-xs", children: "Have a question or want to learn more about our crafts? Reach out and we'll get back to you promptly." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex items-center gap-2 text-[13px] text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 14, className: "text-text-muted-warm" }),
        " ",
        settings.contactPhone
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2 text-[13px] text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 14, className: "text-text-muted-warm" }),
        " ",
        settings.contactEmail
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        ref: formRef,
        onSubmit: handleSubmit,
        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelCls, children: "First Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                name: "firstName",
                value: formData.firstName,
                onChange: handleChange,
                required: true,
                className: inputCls,
                placeholder: "Your first name"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelCls, children: "Last Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                name: "lastName",
                value: formData.lastName,
                onChange: handleChange,
                required: true,
                className: inputCls,
                placeholder: "Your last name"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelCls, children: "Email *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                name: "email",
                value: formData.email,
                onChange: handleChange,
                required: true,
                type: "email",
                className: inputCls,
                placeholder: "you@example.com"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelCls, children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                name: "phone",
                value: formData.phone,
                onChange: handleChange,
                className: inputCls,
                placeholder: "+91 00000 00000"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelCls, children: "Message *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                name: "message",
                value: formData.message,
                onChange: handleChange,
                rows: 4,
                required: true,
                className: inputCls,
                placeholder: "Your message"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "field col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              className: "bg-accent-amber hover:bg-accent-amber-hover text-white px-7 py-3 text-[11px] uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5",
              children: sent ? "Sent ✓" : "Send Message"
            }
          ) })
        ]
      }
    )
  ] }) });
}
function Newsletter() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-bg-dark px-6 md:px-12 py-6 md:py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-[16px] text-white", children: "Subscribe to Our Newsletter" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/50 mt-0.5", children: "Get updates on new arrivals and exclusive offers" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        className: "flex flex-col sm:flex-row gap-3 w-full md:w-auto",
        onSubmit: (e) => {
          e.preventDefault();
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "email",
              placeholder: "Enter your email",
              className: "flex-1 sm:w-64 md:w-72 h-[38px] px-3.5 text-[12px] bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-accent-amber"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-[38px] px-5 bg-accent-amber hover:bg-accent-amber-hover text-white text-[11px] uppercase tracking-[0.12em] transition-colors whitespace-nowrap", children: "Subscribe" })
        ]
      }
    )
  ] }) });
}
const cols = [
  {
    title: "Shop",
    links: ["All Products", "Homeware", "Sculptures", "Vases", "News"]
  },
  {
    title: "Info",
    links: ["About Us", "FAQ", "Help", "Custom Orders", "Contact"]
  },
  {
    title: "Policies",
    links: ["Privacy Policy", "Shipping Policy", "Terms & Conditions", "Refund Policy"]
  }
];
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "bg-footer-bg px-6 md:px-12 pt-12 pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-lg text-white", children: "Artisans Market" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-[0.18em] text-white/40", children: "Handmade marketplace" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-[12px] text-white/50 leading-[1.6] max-w-[200px]", children: "Artisans Market — connecting talented creators with people who value handmade craftsmanship." })
      ] }),
      cols.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] uppercase tracking-[0.18em] text-white/40 mb-4", children: c.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: c.links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "#",
            className: "text-[12px] text-white/60 hover:text-white transition-colors",
            children: l
          }
        ) }, l)) })
      ] }, c.title))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto mt-10 pt-5 border-t border-white/10 flex items-center justify-between text-[11px] text-white/35", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "© 2025 Artisans Market. Handcrafted with care." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-white/50", children: "Artisans Market" })
    ] })
  ] });
}
function Index() {
  const [refreshToken, setRefreshToken] = reactExports.useState(0);
  const navigate = useNavigate();
  const {
    isSignedIn,
    user
  } = useUser();
  reactExports.useEffect(() => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (isSignedIn && isAllowedAdminEmail(email)) {
      navigate({
        to: "/admin"
      });
    }
  }, [isSignedIn, navigate, user?.primaryEmailAddress?.emailAddress]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-h-screen bg-bg-warm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MarketplaceSection, { refreshToken }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SellProductSection, { onProductCreated: () => setRefreshToken((value) => value + 1) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AboutSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OurRange, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FAQ, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ContactSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Newsletter, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  Index as component
};
