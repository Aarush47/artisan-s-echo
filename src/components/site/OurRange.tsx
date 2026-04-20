import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/utils/animations";
import { LayoutGrid, Flower2, Crown, CircleDot } from "lucide-react";

const items = [
  {
    icon: LayoutGrid,
    title: "Dinnerware",
    desc: "Discover our exquisite range of dinnerware that adds elegance to your table setting.",
  },
  {
    icon: Flower2,
    title: "Decorative Vases",
    desc: "Elegance in Bloom — handcrafted vases that bring life to any space.",
  },
  {
    icon: Crown,
    title: "Sculptures",
    desc: "Artistic Masterpieces — original sculptures crafted with skill and vision.",
  },
  {
    icon: CircleDot,
    title: "Custom Orders",
    desc: "Get in touch for bespoke creations that reflect your style and personality.",
  },
];

export function OurRange() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(gridRef.current!.children, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 85%" },
      });
    });
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section id="our-range" className="bg-bg-warm py-16 md:py-20 px-6 md:px-12">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-3xl md:text-4xl text-foreground">Our Range</h2>
        <a
          href="#"
          className="text-[11px] uppercase tracking-[0.12em] text-text-muted-warm border-b border-text-muted-warm pb-0.5 hover:text-accent-amber hover:border-accent-amber transition-colors"
        >
          View More
        </a>
      </div>
      <div ref={gridRef} className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-card-warm border border-card-warm-border p-6 hover:shadow-md transition-shadow"
          >
            <Icon size={28} className="text-text-muted-warm" strokeWidth={1.5} />
            <h3 className="mt-4 font-body font-semibold text-[14px] text-foreground">{title}</h3>
            <p className="mt-2 font-light text-[12px] text-text-muted-warm leading-[1.6]">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}