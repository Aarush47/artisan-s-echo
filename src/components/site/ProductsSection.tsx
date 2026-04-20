import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/utils/animations";
import { ProductCard } from "./ProductCard";
import wallhanging from "@/assets/product-wallhanging.jpg";
import pot from "@/assets/product-pot.jpg";
import painting from "@/assets/product-painting.jpg";
import clothes from "@/assets/product-clothes.jpg";
import watch from "@/assets/product-watch.jpg";

const products = [
  { image: wallhanging, title: "Crafted Wallhanging", price: "₹1,108", badge: "NEW" as const },
  { image: pot, title: "Handmade Pot", price: "₹149", badge: "NEW" as const },
  { image: painting, title: "Painting", price: "₹169", badge: "BEST SELLER" as const },
  { image: clothes, title: "Traditional Clothes Handmade", price: "₹1,000" },
  {
    image: watch,
    title: "Vintage Watch",
    price: "₹10,000",
    originalPrice: "₹25,000",
    badge: "RARE" as const,
  },
];

export function ProductsSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(gridRef.current!.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
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
    <section id="shop-all" className="bg-bg-warm py-16 md:py-20 px-6 md:px-12">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-3xl md:text-4xl text-foreground">Our Products</h2>
        <a
          href="#"
          className="text-[11px] uppercase tracking-[0.12em] text-text-muted-warm border-b border-text-muted-warm pb-0.5 hover:text-accent-amber hover:border-accent-amber transition-colors"
        >
          View All
        </a>
      </div>
      <div
        ref={gridRef}
        className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5"
      >
        {products.map((p) => (
          <ProductCard key={p.title} {...p} />
        ))}
      </div>
    </section>
  );
}