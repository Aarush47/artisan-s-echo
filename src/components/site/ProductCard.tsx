type Badge = "NEW" | "BEST SELLER" | "RARE";

interface Props {
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  badge?: Badge;
}

const badgeStyles: Record<Badge, string> = {
  NEW: "bg-accent-amber text-white",
  "BEST SELLER": "bg-[oklch(0.5_0.12_150)] text-white",
  RARE: "bg-[oklch(0.45_0.18_25)] text-white",
};

export function ProductCard({ image, title, price, originalPrice, badge }: Props) {
  return (
    <article className="bg-card-warm overflow-hidden group">
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {badge && (
          <span
            className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] uppercase tracking-wider font-medium ${badgeStyles[badge]}`}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="px-3.5 pt-3 pb-4">
        <h3 className="font-body font-medium text-[13px] text-foreground">{title}</h3>
        <div className="mt-1 flex items-center gap-2 text-[13px]">
          {originalPrice && (
            <span className="text-text-muted-warm line-through">{originalPrice}</span>
          )}
          <span className="text-foreground">{price}</span>
        </div>
      </div>
    </article>
  );
}