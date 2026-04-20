import { useEffect, useRef } from "react";
import { gsap } from "@/utils/animations";
import heroBg from "@/assets/hero-bg.jpg";
import wallhanging from "@/assets/product-wallhanging.jpg";
import craftsman from "@/assets/hero-craftsman.jpg";

export function Hero() {
  const textRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);

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
    if (card1Ref.current && card2Ref.current) {
      tl.from(
        [card1Ref.current, card2Ref.current],
        { rotation: 0, opacity: 0, y: 30, duration: 1.2, stagger: 0.2, ease: "power3.out" },
        "-=0.6",
      );
    }
  }, []);

  return (
    <section className="relative w-full h-[600px] md:h-[640px] overflow-hidden mt-[52px]">
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
        className="absolute left-6 md:left-16 bottom-16 md:bottom-24 max-w-md text-text-light"
      >
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/70 mb-3">
          Handcrafted with Heart
        </p>
        <h1 className="font-display font-bold text-5xl md:text-[64px] leading-[1.05] text-white">
          Crafted
          <br />
          with <span className="italic text-accent-amber">Care</span>
        </h1>
        <p className="font-body font-light text-[13px] text-white/75 leading-[1.7] mt-5 max-w-sm">
          Explore a world of handcrafted products that tell stories of tradition, innovation, and
          beauty. Each piece is a testament to skill, passion, and craftsmanship.
        </p>
        <button className="mt-7 bg-accent-amber hover:bg-accent-amber-hover text-white px-7 py-3 text-[11px] uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5">
          Shop Now
        </button>
      </div>

      <div className="hidden md:block absolute right-12 lg:right-24 top-1/2 -translate-y-1/2">
        <div
          ref={card1Ref}
          className="absolute -left-8 top-8 w-44 h-56 border-4 border-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden"
          style={{ transform: "rotate(-5deg)" }}
        >
          <img src={wallhanging} alt="Feather wall hanging" className="w-full h-full object-cover" />
        </div>
        <div
          ref={card2Ref}
          className="absolute left-32 -top-4 w-40 h-52 border-4 border-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden"
          style={{ transform: "rotate(4deg)" }}
        >
          <img src={craftsman} alt="Craftsman at work" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}