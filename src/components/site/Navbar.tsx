import { useEffect, useRef, useState } from "react";
import { gsap } from "@/utils/animations";
import { Menu, X } from "lucide-react";

const links = ["Shop All", "About", "Our Range", "FAQs", "Contact"];

export function Navbar() {
  const linksRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

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
          <span className="font-display text-lg font-bold text-foreground">A.Rai</span>
          <span className="hidden sm:block w-px h-4 bg-foreground/30" />
          <span className="hidden sm:block text-[10px] uppercase tracking-[0.18em] text-text-muted-warm">
            Artisans Market
          </span>
        </div>

        <nav ref={linksRef} className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-[11px] uppercase tracking-[0.12em] font-medium text-foreground hover:text-accent-amber transition-colors"
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden md:inline-flex items-center justify-center border border-foreground px-4 py-1.5 text-[10px] uppercase tracking-[0.12em] hover:bg-foreground hover:text-text-light transition-colors">
            Log In
          </button>
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
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setOpen(false)}
              className="text-[11px] uppercase tracking-[0.12em] font-medium text-foreground"
            >
              {l}
            </a>
          ))}
          <button className="self-start border border-foreground px-4 py-1.5 text-[10px] uppercase tracking-[0.12em]">
            Log In
          </button>
        </div>
      )}
    </header>
  );
}