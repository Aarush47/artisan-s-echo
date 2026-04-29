import { useEffect, useRef, useState } from "react";
import { gsap } from "@/utils/animations";
import heroBg from "@/assets/hero-bg.jpg";
import { getSiteSettings } from "@/lib/siteSettings";

export function Hero() {
  const textRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState(getSiteSettings());

  useEffect(() => {
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

  useEffect(() => {
    const tl = gsap.timeline();
    if (textRef.current) {
      tl.from(textRef.current.children, {
        x: -30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
      });
    }
  }, []);

  return (
    <section className="relative w-full h-[480px] sm:h-[550px] md:h-[640px] overflow-hidden mt-[52px]">
      <img
        src={heroBg}
        alt="Handcrafted wooden bowls"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1024}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, oklch(0.18 0.018 60 / 0.8) 40%, oklch(0.18 0.018 60 / 0.15) 100%)",
        }}
      />

      <div
        ref={textRef}
        className="absolute left-4 sm:left-6 md:left-16 bottom-8 sm:bottom-12 md:bottom-24 max-w-md text-text-light"
      >
        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-white/70 mb-2 sm:mb-3">
          {settings.heroBadge}
        </p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-[64px] leading-[1.05] text-white">
          {settings.heroTitleLine1}
          <br />
          with <span className="italic text-accent-amber">{settings.heroTitleAccent}</span>
        </h1>
        <p className="font-body font-light text-[12px] sm:text-[13px] text-white/75 leading-[1.7] mt-3 sm:mt-5 max-w-sm">
          {settings.heroDescription}
        </p>
        <button className="mt-5 sm:mt-7 bg-accent-amber hover:bg-accent-amber-hover text-white px-6 sm:px-7 py-2.5 sm:py-3 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5">
          Shop Now
        </button>
      </div>
    </section>
  );
}