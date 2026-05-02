import { useLocation } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useState } from "react";
import { useAdHeadline } from "@/hooks/useAdHeadline";

const faqs = [
  {
    q: "How much does a will cost?",
    a: "We work on a fixed-fee basis, so you'll know the exact cost before you commit to anything. Fees depend on your circumstances — single will, mirror wills, or a more complex estate — but there are no hidden charges or hourly billing. We'll confirm the fee during your free initial call.",
  },
  {
    q: "Do I really need a solicitor or can I do it myself?",
    a: "You can write your own will, but DIY wills are one of the most common causes of contested estates and unintended outcomes. Small errors in wording, incorrect witnessing, or failing to account for life events can make a will invalid or mean your wishes aren't followed. A solicitor-drafted will is legally watertight and costs a fraction of what disputes can cost your family.",
  },
  {
    q: "How long does it take?",
    a: "Most clients have their will completed within one to two weeks of their first call. We work at your pace — if you need it done quickly, we can often turn it around faster.",
  },
  {
    q: "What if I already have a will but it's old?",
    a: "Older wills may not reflect changes in your life, family, or the law. Marriage, divorce, new children, property changes, and new tax rules can all affect whether your will does what you intended. A review is usually straightforward — we'll tell you if it still stands up or if it needs updating.",
  },
  {
    q: "What about my pension and life insurance?",
    a: "Pensions and life insurance policies typically don't form part of your estate — they pay out based on nomination forms held by the provider, not your will. This means your will and your nominations can conflict. We'll flag this during your call and make sure you understand how your arrangements fit together.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="w-full text-left flex justify-between items-center gap-4 font-semibold text-[#1a3a4a] hover:text-[#0e7490] transition-colors"
        onClick={() => setOpen(!open)}
        data-testid={`faq-toggle-${q.slice(0, 20).replace(/\s/g, "-").toLowerCase()}`}
      >
        <span>{q}</span>
        <span className="text-xl flex-shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="mt-3 text-gray-600 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function WillWritingLanding() {
  const [, setLocation] = useLocation();
  const adHeadline = useAdHeadline("");

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-[#1a3a4a] text-white py-14 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {adHeadline ? (
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {adHeadline}
            </h1>
          ) : (
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              What Happens to Your Family<br className="hidden sm:block" />
              <span className="text-[#5eead4]"> If Something Happens to You?</span>
            </h1>
          )}
          <p className="text-base sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            56% of UK adults don't have a will. Take our free 2-minute check to find out if your family is protected.
          </p>
          <button
            data-testid="hero-cta-will-writing"
            onClick={() => setLocation("/will-writing/quiz")}
            className="w-full sm:w-auto bg-[#0e7490] hover:bg-[#0a5a70] text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
          >
            Check Your Will Status →
          </button>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-gray-300">
            {["SRA Regulated", "Fixed Fees, No Surprises", "Carlisle-Based", "Free Assessment"].map((t) => (
              <span key={t} className="flex items-center gap-1">
                <span className="text-[#5eead4]">✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Empathy */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3a4a] text-center mb-6">
            This Isn't About Now. It's About Protecting Your Family.
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed text-center mb-12 max-w-3xl mx-auto">
            Most people put off writing a will because it feels morbid or complicated. It's neither. A will is simply the clearest way to say: if something happens to me, here's how I want my family looked after. One appointment. Fixed fee. Done.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Your family\nstays protected",
                body: "Without a will, the law decides who inherits, who raises your children, and what happens to your home — not you. A will puts your wishes on record.",
              },
              {
                title: "No guesswork\nfor loved ones",
                body: "A clear will removes uncertainty for the people you leave behind. They won't be left dealing with legal complications at an already difficult time.",
              },
              {
                title: "Simpler than\nyou think",
                body: "Most wills are straightforward. We handle everything after your first call — drafting, checking, witnessing guidance. Fixed fee, no surprises.",
              },
            ].map((c) => (
              <div key={c.title} className="flex flex-col text-center p-6 rounded-xl bg-gray-50">
                <h3 className="font-bold text-[#1a3a4a] text-lg mb-3 whitespace-pre-line">{c.title}</h3>
                <p className="text-gray-600">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <section className="py-12 px-4 bg-[#0e7490]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Find out if your family is protected in 2 minutes
          </h2>
          <p className="text-white/80 mb-6">
            Answer 4 quick questions. We'll show you exactly what your situation means — and what, if anything, needs to change.
          </p>
          <button
            data-testid="mid-cta-will-writing"
            onClick={() => setLocation("/will-writing/quiz")}
            className="w-full sm:w-auto bg-white text-[#0e7490] font-bold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors"
          >
            Check Your Will Status →
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3a4a] text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Take the 2-minute check",
                body: "Answer 4 questions about your current situation. We'll calculate your result and tell you what it means for your family.",
              },
              {
                step: "2",
                title: "We call you within 24 hours",
                body: "A Carlisle-based solicitor will call at a time that suits you. We'll explain your options in plain English — no jargon, no pressure.",
              },
              {
                step: "3",
                title: "One appointment. Fixed fee. Done.",
                body: "Most wills are completed within a week of your first call. We handle everything — drafting, reviewing, and signing guidance.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#0e7490] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-[#1a3a4a] text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-12 px-4 bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "SRA Regulated", sub: "Solicitors Regulation Authority No. 800525" },
              { label: "Fixed Fees", sub: "No hidden costs or hourly billing" },
              { label: "Carlisle-Based", sub: "Serving Cumbria and the surrounding area" },
              { label: "Free Initial Call", sub: "No obligation to proceed" },
            ].map((t) => (
              <div key={t.label}>
                <p className="font-bold text-[#1a3a4a] text-sm">{t.label}</p>
                <p className="text-gray-500 text-xs mt-1">{t.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3a4a] text-center mb-10">Common Questions</h2>
          {faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-[#1a3a4a]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Take 2 minutes now. Give your family peace of mind.
          </h2>
          <p className="text-gray-300 mb-8">
            Free check. No obligation. A solicitor will call you within 24 hours to talk through your results.
          </p>
          <button
            data-testid="footer-cta-will-writing"
            onClick={() => setLocation("/will-writing/quiz")}
            className="w-full sm:w-auto bg-[#0e7490] hover:bg-[#0a5a70] text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            Check Your Will Status →
          </button>
          <p className="mt-4 text-gray-400 text-sm">
            Or call us now:{" "}
            <a href="tel:+441228272395" className="text-[#5eead4] font-semibold">01228 272395</a>
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
