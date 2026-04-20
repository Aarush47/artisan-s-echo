import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/utils/animations";
import { Phone, Mail } from "lucide-react";

export function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    if (!formRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(formRef.current!.querySelectorAll(".field"), {
        y: 15,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: formRef.current, start: "top 85%" },
      });
    });
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  const labelCls = "text-[10px] uppercase tracking-[0.12em] text-text-muted-warm mb-1.5 block";
  const inputCls =
    "w-full border border-input-border px-3 py-2.5 text-[13px] focus:border-accent-amber focus:outline-none bg-white";

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = `New inquiry from ${formData.firstName} ${formData.lastName}`;
    const body = [
      `First Name: ${formData.firstName}`,
      `Last Name: ${formData.lastName}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone || "N/A"}`,
      "",
      "Message:",
      formData.message || "(No message provided)",
    ].join("\n");

    const mailtoUrl = `mailto:arpitarll28@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    setSent(true);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    });
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <section id="contact" className="bg-white py-20 px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 md:gap-12 max-w-6xl mx-auto">
        <div>
          <h2 className="font-display text-3xl md:text-[36px] text-foreground">Get in Touch</h2>
          <p className="mt-4 font-light text-[13px] text-text-muted-warm leading-[1.7] max-w-xs">
            Have a question or want to learn more about our crafts? Reach out and we'll get back to
            you promptly.
          </p>
          <div className="mt-8 flex items-center gap-2 text-[13px] text-foreground">
            <Phone size={14} className="text-text-muted-warm" /> 7099340119
          </div>
          <div className="mt-2 flex items-center gap-2 text-[13px] text-foreground">
            <Mail size={14} className="text-text-muted-warm" /> arpitarll28@gmail.com
          </div>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="field">
            <label className={labelCls}>First Name *</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className={inputCls}
              placeholder="Your first name"
            />
          </div>
          <div className="field">
            <label className={labelCls}>Last Name *</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className={inputCls}
              placeholder="Your last name"
            />
          </div>
          <div className="field col-span-2">
            <label className={labelCls}>Email *</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              type="email"
              className={inputCls}
              placeholder="you@example.com"
            />
          </div>
          <div className="field col-span-2">
            <label className={labelCls}>Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputCls}
              placeholder="+91 00000 00000"
            />
          </div>
          <div className="field col-span-2">
            <label className={labelCls}>Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              required
              className={inputCls}
              placeholder="Your message"
            />
          </div>
          <div className="field col-span-2">
            <button
              type="submit"
              className="bg-accent-amber hover:bg-accent-amber-hover text-white px-7 py-3 text-[11px] uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5"
            >
              {sent ? "Sent ✓" : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}