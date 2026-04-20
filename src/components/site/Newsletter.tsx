export function Newsletter() {
  return (
    <section className="bg-bg-dark px-6 md:px-12 py-6 md:py-5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-[16px] text-white">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-[11px] text-white/50 mt-0.5">
            Get updates on new arrivals and exclusive offers
          </p>
        </div>
        <form
          className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 sm:w-64 md:w-72 h-[38px] px-3.5 text-[12px] bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-accent-amber"
          />
          <button className="h-[38px] px-5 bg-accent-amber hover:bg-accent-amber-hover text-white text-[11px] uppercase tracking-[0.12em] transition-colors whitespace-nowrap">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}