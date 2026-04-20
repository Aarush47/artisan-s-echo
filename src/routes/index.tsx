import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { ProductsSection } from "@/components/site/ProductsSection";
import { MarketplaceSection } from "@/components/site/MarketplaceSection";
import { SellProductSection } from "@/components/site/SellProductSection";
import { AboutSection } from "@/components/site/AboutSection";
import { OurRange } from "@/components/site/OurRange";
import { FAQ } from "@/components/site/FAQ";
import { ContactSection } from "@/components/site/ContactSection";
import { Newsletter } from "@/components/site/Newsletter";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Artisans Market | Handcrafted with Care" },
      {
        name: "description",
        content:
          "Discover handcrafted products that tell stories of tradition, skill and passion. Shop wallhangings, pottery, paintings and more from Artisans Market.",
      },
      { property: "og:title", content: "Artisans Market" },
      {
        property: "og:description",
        content: "Handcrafted products with heart. Crafted with care by talented artisans.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [refreshToken, setRefreshToken] = useState(0);

  return (
    <main className="min-h-screen bg-bg-warm">
      <Navbar />
      <Hero />
      <ProductsSection />
      <MarketplaceSection refreshToken={refreshToken} />
      <SellProductSection onProductCreated={() => setRefreshToken((value) => value + 1)} />
      <AboutSection />
      <OurRange />
      <FAQ />
      <ContactSection />
      <Newsletter />
      <Footer />
    </main>
  );
}
