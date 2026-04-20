import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/utils/animations";
import about from "@/assets/about-craftsman.jpg";

export function AboutSection() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        x: -40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: leftRef.current, start: "top 80%" },
      });
      gsap.from(rightRef.current, {
        x: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: rightRef.current, start: "top 80%" },
      });
    });
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section id="about" className="bg-bg-dark py-20 px-6 md:px-12">
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        <div ref={leftRef} className="text-text-light">
          <h2 className="font-display text-4xl md:text-[40px] leading-[1.15] text-white">
            About
            <br />
            Artisans Market
          </h2>
          <p className="mt-6 font-light text-[13px] text-white/70 leading-[1.8]">
            Welcome to Artisans Market, where every product tells a story of skill, culture, and
            passion.
          </p>
          <p className="mt-4 font-light text-[13px] text-white/70 leading-[1.8]">
            We connect talented creators with people who truly value handmade craftsmanship. Each
            piece is carefully selected to bring authenticity, beauty, and meaning into your life.
          </p>
          <p className="mt-4 font-light text-[13px] text-white/70 leading-[1.8]">
            Shop with us and support artisans while discovering something truly unique.
          </p>
          <button className="mt-8 bg-accent-amber hover:bg-accent-amber-hover text-white px-7 py-3 text-[11px] uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5">
            Explore Shop
          </button>
        </div>
        <div ref={rightRef} className="md:translate-x-6">
          <img
            src={about}
            alt="Craftsman painting elephant"
            loading="lazy"
            className="w-full h-[440px] object-cover shadow-[0_12px_48px_rgba(0,0,0,0.6)]"
          />
        </div>
      </div>
    </section>
  );
}