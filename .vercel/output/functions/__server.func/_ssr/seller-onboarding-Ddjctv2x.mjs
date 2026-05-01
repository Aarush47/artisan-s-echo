import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { S as SignInButton, a as SignUpButton } from "../_libs/clerk__react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as Card, B as Button, g as getSellerProfile, r as readFileAsDataUrl, u as upsertSellerProfile } from "./sellerProfiles-BBPVzNtq.mjs";
import { I as Input, T as Textarea } from "./textarea-CLAGzfBk.mjs";
import { L as Label } from "./label-BU6RIgNz.mjs";
import { o as useUser } from "../_libs/clerk__shared.mjs";
import { L as LoaderCircle, U as Upload, B as BadgeCheck } from "../_libs/lucide-react.mjs";
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
import "./router-VTNU8hFh.mjs";
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
function SellerOnboardingPage() {
  const {
    isSignedIn,
    user
  } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [existingProfile, setExistingProfile] = reactExports.useState(null);
  const [fullName, setFullName] = reactExports.useState("");
  const [phoneNumber, setPhoneNumber] = reactExports.useState("");
  const [address, setAddress] = reactExports.useState("");
  const [governmentIdType, setGovernmentIdType] = reactExports.useState("Aadhaar Card");
  const [governmentIdNumber, setGovernmentIdNumber] = reactExports.useState("");
  const [profilePhotoFile, setProfilePhotoFile] = reactExports.useState(null);
  const [governmentIdFile, setGovernmentIdFile] = reactExports.useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = reactExports.useState("");
  const [governmentIdPreview, setGovernmentIdPreview] = reactExports.useState("");
  reactExports.useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      if (!isSignedIn || !user) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }
      setLoading(true);
      const result = await getSellerProfile(user.id);
      if (!isMounted) return;
      setExistingProfile(result.data);
      setFullName(result.data?.full_name ?? [user.firstName, user.lastName].filter(Boolean).join(" "));
      setPhoneNumber(result.data?.phone_number ?? "");
      setAddress(result.data?.address ?? "");
      setGovernmentIdType(result.data?.government_id_type ?? "Aadhaar Card");
      setGovernmentIdNumber(result.data?.government_id_number ?? "");
      setProfilePhotoPreview(result.data?.profile_photo_url ?? "");
      setGovernmentIdPreview(result.data?.government_id_url ?? "");
      setLoading(false);
      if (result.error) {
        toast.error(result.error);
      }
    }
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [isSignedIn, user?.id]);
  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      setProfilePhotoFile(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file for the profile photo.");
      event.target.value = "";
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setProfilePhotoFile(file);
      setProfilePhotoPreview(dataUrl);
    } catch {
      toast.error("Unable to read the profile photo. Please choose another file.");
      event.target.value = "";
    }
  }
  async function handleDocumentChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      setGovernmentIdFile(null);
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setGovernmentIdFile(file);
      setGovernmentIdPreview(dataUrl);
    } catch {
      toast.error("Unable to read the government document. Please choose another file.");
      event.target.value = "";
    }
  }
  async function handleSubmit(event) {
    event.preventDefault();
    if (!isSignedIn || !user) {
      toast.error("Please sign in first.");
      return;
    }
    if (!fullName.trim() || !phoneNumber.trim() || !address.trim() || !governmentIdType.trim() || !governmentIdNumber.trim()) {
      toast.error("Please fill in all seller details.");
      return;
    }
    setSaving(true);
    try {
      const profilePhotoUrl = profilePhotoFile ? await readFileAsDataUrl(profilePhotoFile) : existingProfile?.profile_photo_url ?? null;
      const governmentIdUrl = governmentIdFile ? await readFileAsDataUrl(governmentIdFile) : existingProfile?.government_id_url ?? null;
      const result = await upsertSellerProfile({
        clerkUserId: user.id,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        governmentIdType: governmentIdType.trim(),
        governmentIdNumber: governmentIdNumber.trim(),
        profilePhotoUrl,
        governmentIdUrl
      });
      if (!result.data) {
        toast.error(result.error ?? "Unable to save seller profile.");
        return;
      }
      setExistingProfile(result.data);
      toast.success("Seller profile saved. Admin review is pending.");
      navigate({
        to: "/"
      });
    } catch {
      toast.error("Unable to save seller profile right now.");
    } finally {
      setSaving(false);
    }
  }
  if (!isSignedIn) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "min-h-screen bg-bg-warm px-6 py-20 md:px-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-card-warm-border bg-card-warm p-8 md:p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.2em] text-text-muted-warm", children: "Seller onboarding" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-display text-3xl text-foreground", children: "Sign in to continue" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm leading-[1.8] text-text-muted-warm", children: "Create your account first, then complete your seller profile with verification details." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SignInButton, { mode: "modal", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "border border-foreground px-4 py-2 text-[10px] uppercase tracking-[0.15em] hover:bg-foreground hover:text-text-light transition-colors", children: "Sign In" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SignUpButton, { mode: "modal", afterSignUpUrl: "/seller-onboarding", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-foreground px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-text-light transition-colors hover:bg-foreground/90", children: "Sign Up" }) })
      ] })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "min-h-screen bg-bg-warm px-6 py-20 md:px-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.2em] text-text-muted-warm", children: "Seller onboarding" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-display text-4xl text-foreground", children: "Complete your profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-2xl text-sm leading-[1.8] text-text-muted-warm", children: "Add your details and government document so an admin can verify your account manually." })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex items-center gap-3 border border-card-warm-border bg-card-warm p-6 text-text-muted-warm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-accent-amber" }),
      "Loading your seller profile..."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-card-warm-border bg-card-warm p-6 md:p-8", children: [
      existingProfile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 rounded-lg bg-bg-warm px-4 py-3 text-sm text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Current status:" }),
        " ",
        existingProfile.verification_status,
        existingProfile.is_blocked ? " - blocked" : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-5", onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "seller-full-name", children: "Full name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "seller-full-name", value: fullName, onChange: (event) => setFullName(event.target.value), placeholder: "Your full legal name", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "seller-phone-number", children: "Phone number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "seller-phone-number", value: phoneNumber, onChange: (event) => setPhoneNumber(event.target.value), placeholder: "9876543210", inputMode: "tel", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "seller-government-id-type", children: "Gov. document type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "seller-government-id-type", value: governmentIdType, onChange: (event) => setGovernmentIdType(event.target.value), placeholder: "Aadhaar Card", required: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "seller-address", children: "Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "seller-address", value: address, onChange: (event) => setAddress(event.target.value), placeholder: "Your full address", rows: 4, required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "seller-government-id-number", children: "Gov. document number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "seller-government-id-number", value: governmentIdNumber, onChange: (event) => setGovernmentIdNumber(event.target.value), placeholder: "Document number", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "seller-profile-photo", children: "Profile photo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "seller-profile-photo", className: "flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-card-warm-border bg-bg-warm/60 px-4 py-6 text-center transition-colors hover:border-accent-amber hover:bg-accent-amber/5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-5 w-5 text-accent-amber" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: "Upload a seller photo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "seller-profile-photo", type: "file", accept: "image/*", className: "hidden", onChange: handlePhotoChange })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "seller-government-document", children: "Government document upload" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "seller-government-document", className: "flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-card-warm-border bg-bg-warm/60 px-4 py-6 text-center transition-colors hover:border-accent-amber hover:bg-accent-amber/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-5 w-5 text-accent-amber" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: "Upload Aadhaar, PAN, or another document" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "seller-government-document", type: "file", accept: "image/*,application/pdf", className: "hidden", onChange: handleDocumentChange })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
          profilePhotoPreview && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-xl border border-card-warm-border bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: profilePhotoPreview, alt: "Profile preview", className: "h-56 w-full object-cover" }) }),
          governmentIdPreview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-card-warm-border bg-white p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Document preview" }),
            governmentIdPreview.startsWith("data:image") ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: governmentIdPreview, alt: "Document preview", className: "mt-3 h-56 w-full object-contain" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: governmentIdPreview, target: "_blank", rel: "noreferrer", className: "mt-3 inline-flex text-sm text-accent-amber underline", children: "Open uploaded document" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: saving, className: "bg-accent-amber hover:bg-accent-amber-hover text-white", children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
            "Saving profile"
          ] }) : "Save seller profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => navigate({
            to: "/"
          }), children: "Back to home" })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  SellerOnboardingPage as component
};
