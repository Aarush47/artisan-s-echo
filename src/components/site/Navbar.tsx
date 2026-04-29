import { useEffect, useRef, useState } from "react";
import { gsap } from "@/utils/animations";
import { LogOut, Menu, X } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useClerk, useUser } from "@clerk/react";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { isAllowedAdminEmail } from "@/lib/sellerProfiles";

const links = [
  { label: "Marketplace", href: "#marketplace" },
  { label: "About", href: "#about" },
  { label: "Our Range", href: "#our-range" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const linksRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { signOut } = useClerk();
  const { isSignedIn, user } = useUser();
  const { isAdmin } = useAdminAccess(isSignedIn ? user?.id : undefined, user?.primaryEmailAddress?.emailAddress);
  const navLinks = isSignedIn
    ? [
        ...links,
        ...((isAdmin || isAllowedAdminEmail(user?.primaryEmailAddress?.emailAddress)) ? [{ label: "Admin Portal", href: "/admin" }] : []),
        { label: "Sell Your Craft", href: "#sell" },
      ]
    : links;

  useEffect(() => {
    if (!linksRef.current) return;
    gsap.from(linksRef.current.children, {
      y: -8,
      opacity: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: "power2.out",
    });
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[52px] bg-nav-bg backdrop-blur-md border-b border-black/10">
      <div className="h-full px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-display text-lg font-bold text-foreground">Artisans Market</span>
          <span className="hidden sm:block w-px h-4 bg-foreground/30" />
          <span className="hidden sm:block text-[10px] uppercase tracking-[0.18em] text-text-muted-warm">
            Handmade marketplace
          </span>
        </div>

        <nav ref={linksRef} className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[11px] uppercase tracking-[0.12em] font-medium text-foreground hover:text-accent-amber transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <div className="hidden md:flex items-center gap-3">
              <UserButton />
              <button
                type="button"
                onClick={() => signOut({ redirectUrl: "/" })}
                className="inline-flex items-center gap-2 rounded-md border border-foreground px-4 py-1.5 text-[10px] uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-foreground hover:text-text-light"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-3">
                <SignInButton mode="modal">
                  <button className="border border-foreground px-4 py-1.5 text-[10px] uppercase tracking-[0.12em] hover:bg-foreground hover:text-text-light transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal" forceRedirectUrl="/seller-onboarding">
                  <button className="bg-foreground text-text-light px-4 py-1.5 text-[10px] uppercase tracking-[0.12em] hover:bg-foreground/90 transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </>
          )}
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-nav-bg backdrop-blur-md border-b border-black/10 px-6 py-4 flex flex-col gap-3">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[11px] uppercase tracking-[0.12em] font-medium text-foreground"
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-3 mt-2 flex-col sm:flex-row">
            {isSignedIn ? (
              <div className="flex flex-col gap-3">
                <UserButton />
                <button
                  type="button"
                  onClick={() => signOut({ redirectUrl: "/" })}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-foreground px-4 py-2 text-[10px] uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-foreground hover:text-text-light"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="flex-1 border border-foreground px-4 py-1.5 text-[10px] uppercase tracking-[0.12em] hover:bg-foreground hover:text-text-light transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal" forceRedirectUrl="/seller-onboarding">
                  <button className="flex-1 bg-foreground text-text-light px-4 py-1.5 text-[10px] uppercase tracking-[0.12em] hover:bg-foreground/90 transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}