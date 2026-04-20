const cols = [
  {
    title: "Shop",
    links: ["All Products", "Homeware", "Sculptures", "Vases", "News"],
  },
  {
    title: "Info",
    links: ["About Us", "FAQ", "Help", "Custom Orders", "Contact"],
  },
  {
    title: "Policies",
    links: ["Privacy Policy", "Shipping Policy", "Terms & Conditions", "Refund Policy"],
  },
];

export function Footer() {
  return (
    <footer className="bg-footer-bg px-6 md:px-12 pt-12 pb-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-lg text-white">Artisans Market</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">
              Handmade marketplace
            </span>
          </div>
          <p className="mt-4 text-[12px] text-white/50 leading-[1.6] max-w-[200px]">
            Artisans Market — connecting talented creators with people who value handmade
            craftsmanship.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="text-[10px] uppercase tracking-[0.18em] text-white/40 mb-4">
              {c.title}
            </h4>
            <ul className="space-y-2">
              {c.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-[12px] text-white/60 hover:text-white transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-5 border-t border-white/10 flex items-center justify-between text-[11px] text-white/35">
        <span>© 2025 Artisans Market. Handcrafted with care.</span>
        <span className="font-display text-white/50">Artisans Market</span>
      </div>
    </footer>
  );
}