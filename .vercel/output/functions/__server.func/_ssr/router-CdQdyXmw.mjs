import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as createRouter, u as useRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, H as HeadContent, S as Scripts, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { C as ClerkProvider } from "../_libs/clerk__react.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
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
import "../_libs/clerk__shared.mjs";
import "../_libs/dequal.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const supabaseUrl = "https://jbahpkwyzdiriinbynck.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiYWhwa3d5emRpcmlpbmJ5bmNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDc5NzQsImV4cCI6MjA5MjI4Mzk3NH0.GfvfHNGILYPNDATtItxDtFAk8LL7tRiGAyBHcXs2ToY";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase.from("products").select("id").limit(1);
    if (error) {
      console.error("Database connection error:", error);
      return { success: false, error: error.message };
    }
    console.log("✓ Database connection successful");
    return { success: true, data };
  } catch (err) {
    console.error("Connection test failed:", err);
    return { success: false, error: String(err) };
  }
}
function useSupabaseConnection() {
  const [status, setStatus] = reactExports.useState({
    connected: false,
    loading: true
  });
  reactExports.useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testDatabaseConnection();
        setStatus({
          connected: result.success,
          error: result.error,
          loading: false
        });
        if (!result.success) {
          console.error("❌ Supabase connection failed:", result.error);
        }
      } catch (err) {
        setStatus({
          connected: false,
          error: String(err),
          loading: false
        });
      }
    };
    checkConnection();
  }, []);
  return status;
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const appCss = "/assets/styles-DRdTrpBu.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
const Route$4 = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Artisans Market" },
      { name: "description", content: "Artisans Market — a handcrafted marketplace for unique products." },
      { name: "author", content: "Artisans Market" },
      { property: "og:title", content: "Artisans Market" },
      { property: "og:description", content: "Artisans Market — a handcrafted marketplace for unique products." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@ArtisansMarket" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ClerkProvider, { publishableKey: "pk_test_ZW5hYmxlZC1nbmF0LTcyLmNsZXJrLmFjY291bnRzLmRldiQ", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SupabaseProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" })
  ] }) });
}
function SupabaseProvider({ children }) {
  const { connected, error, loading } = useSupabaseConnection();
  if (!loading) {
    if (connected) {
      console.log("✅ Supabase database connected successfully");
    } else {
      console.error("❌ Supabase connection failed:", error);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
const $$splitComponentImporter$3 = () => import("./seller-onboarding-Ck5TEvO5.mjs");
const Route$3 = createFileRoute("/seller-onboarding")({
  head: () => ({
    meta: [{
      title: "Seller Onboarding | Artisans Market"
    }, {
      name: "description",
      content: "Complete your seller profile with verification details before listing products."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin-DNJ3Ecez.mjs");
const Route$2 = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "Admin Portal | Artisans Market"
    }, {
      name: "description",
      content: "Manage seller profiles, verification documents, blocking, and admin roles."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./index-NVwtd2C7.mjs");
const Route$1 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Artisans Market | Handcrafted with Care"
    }, {
      name: "description",
      content: "Discover handcrafted products that tell stories of tradition, skill and passion. Shop wallhangings, pottery, paintings and more from Artisans Market."
    }, {
      property: "og:title",
      content: "Artisans Market"
    }, {
      property: "og:description",
      content: "Handcrafted products with heart. Crafted with care by talented artisans."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./my-listings-Bwocpvg9.mjs");
const Route = createFileRoute("/marketplace/my-listings")({
  head: () => ({
    meta: [{
      title: "My Listings | A.Rai Marketplace"
    }, {
      name: "description",
      content: "Manage your product listings"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SellerOnboardingRoute = Route$3.update({
  id: "/seller-onboarding",
  path: "/seller-onboarding",
  getParentRoute: () => Route$4
});
const AdminRoute = Route$2.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$4
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$4
});
const MarketplaceMyListingsRoute = Route.update({
  id: "/marketplace/my-listings",
  path: "/marketplace/my-listings",
  getParentRoute: () => Route$4
});
const rootRouteChildren = {
  IndexRoute,
  AdminRoute,
  SellerOnboardingRoute,
  MarketplaceMyListingsRoute
};
const routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  router as r,
  supabase as s
};
