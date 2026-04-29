export interface SiteSettings {
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleAccent: string;
  heroDescription: string;
  contactPhone: string;
  contactEmail: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroBadge: "Handcrafted with Heart",
  heroTitleLine1: "Crafted",
  heroTitleAccent: "Care",
  heroDescription:
    "Explore a world of handcrafted products that tell stories of tradition, innovation, and beauty. Each piece is a testament to skill, passion, and craftsmanship.",
  contactPhone: "+91-7559360218",
  contactEmail: "arpitrai924@gmail.com",
};

const SITE_SETTINGS_KEY = "artisan-echo-site-settings";

export function getSiteSettings(): SiteSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SITE_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(SITE_SETTINGS_KEY);
    if (!raw) return DEFAULT_SITE_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    return {
      ...DEFAULT_SITE_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export function saveSiteSettings(next: SiteSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(next));
}
