import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Common Queries",
    a: "Find answers to our most frequently asked questions about our products and services.",
  },
  {
    q: "Shipping & Delivery",
    a: "We offer nationwide shipping within 5–7 business days. Express options available at checkout.",
  },
  {
    q: "Custom Orders",
    a: "Yes, we accept custom orders. Contact us with your requirements and we'll get back to you.",
  },
  {
    q: "Care Instructions",
    a: "Most handcrafted items require gentle care. Avoid direct sunlight and harsh chemicals.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faqs" className="bg-faq-bg py-20 px-6 md:px-12">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-3xl md:text-[36px] text-center text-foreground mb-12">
          Frequently Asked Questions
        </h2>
        <div>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-black/15">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full py-5 flex items-center justify-between text-left"
                >
                  <span className="font-body font-medium text-[14px] text-foreground">{f.q}</span>
                  {isOpen ? (
                    <Minus size={18} className="text-text-muted-warm" />
                  ) : (
                    <Plus size={18} className="text-text-muted-warm" />
                  )}
                </button>
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 font-light text-[13px] text-text-muted-warm leading-[1.7]">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}