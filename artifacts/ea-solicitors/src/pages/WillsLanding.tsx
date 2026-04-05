import { useLocation } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useState } from "react";
import { useAdHeadline } from "@/hooks/useAdHeadline";

const willsReviews = [
  {
    name: "Sally Grisedale",
    verified: true,
    date: "8 Jun 2025",
    title: "Highly Recommend Edward & Amaury Solicitors for UK Wills",
    body: "I cannot recommend Edward & Amaury Solicitors highly enough, particularly for anyone navigating the complexities of setting up a UK will — especially as a dual US and UK citizen. My experience was exceptional, largely thanks to solicitor Fiona Reid. Her knowledge was truly vast and incredibly impressive. She expertly guided me through the intricate process, making what could have been a daunting task feel manageable and clear. The entire team provided an outstanding service, at a very reasonable price. I am so grateful for their expertise and support.",
  },
];

const faqs = [
  {
    q: "How much does probate cost?",
    a: "We work on a fixed-fee basis, so you'll know exactly what you'll pay from the start — no hourly billing, no hidden extras. The fee is assessed based on your estate during your free initial call.",
  },
  {
    q: "What if there's no will?",
    a: "If someone dies without a will (intestate), their estate is distributed according to the rules of intestacy. We handle both testate (with a will) and intestate estates and will guide you through what this means for your specific situation.",
  },
  {
    q: "How long does probate take?",
    a: "Most estates take between 3 and 6 months to complete probate, though complex estates can take longer. We'll give you a realistic timeline during your free call.",
  },
  {
    q: "Do I need to come to your office?",
    a: "Not at all. We work with clients by phone and email throughout the process. If you prefer a face-to-face appointment in Carlisle, we're always happy to arrange that too.",
  },
  {
    q: "What do I need to bring to the first call?",
    a: "Just a general idea of your situation. We'll ask the questions we need to understand the estate and what needs to happen next. You don't need documents or paperwork ready for the initial call.",
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

export default function WillsLanding() {
  const [, setLocation] = useLocation();
  const adHeadline = useAdHeadline("");

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-[#1a3a4a] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {adHeadline ? (
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {adHeadline}
            </h1>
          ) : (
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Dealing With Probate in Cumbria?<br className="hidden sm:block" />
              <span className="text-[#5eead4]"> We'll Handle It So You Don't Have To.</span>
            </h1>
          )}
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Local, fixed-fee probate solicitors in Carlisle. We take the stress, paperwork, and legal complexity off your hands — so you can focus on your family.
          </p>
          <button
            data-testid="hero-cta-wills"
            onClick={() => setLocation("/wills-and-probate/quiz")}
            className="bg-[#0e7490] hover:bg-[#0a5a70] text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
          >
            Find Out What You Need →
          </button>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-300">
            {["Rated on Google", "SRA Regulated", "Fixed Fees, No Surprises", "Carlisle-Based"].map((t) => (
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
            We Understand This Is a Difficult Time
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed text-center mb-12 max-w-3xl mx-auto">
            Losing someone is hard enough. The last thing you need is confusing legal paperwork, unexpected costs, and a process that drags on for months. Whether your loved one left a will or not, we can help. We've guided hundreds of families across Cumbria through the probate process — and we'll guide you too.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "With or without a will",
                body: "We handle both testate and intestate estates, and will explain exactly what applies to your situation.",
              },
              {
                title: "Fixed fees from the start",
                body: "No hourly billing, no hidden charges, no surprises. You'll know exactly what you'll pay before we begin.",
              },
              {
                title: "A real person, locally",
                body: "Speak to a Carlisle-based solicitor who knows your community — not a call centre.",
              },
            ].map((col) => (
              <div key={col.title} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="w-8 h-1 bg-[#0e7490] mb-4 rounded" />
                <h3 className="font-bold text-[#1a3a4a] text-lg mb-2">{col.title}</h3>
                <p className="text-gray-600">{col.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-10">
            <img src="/review-solicitors-logo.png" alt="Review Solicitors" className="h-10 mb-5" />
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl font-bold text-[#1a3a4a]">4.9</span>
              <div>
                <p className="font-bold text-[#1a3a4a] text-lg leading-tight">Excellent</p>
                <div className="flex text-[#3a9e4f] text-2xl leading-none">{"★★★★★"}</div>
                <p className="text-sm text-[#3a9e4f] font-medium underline">60 Reviews</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {[
                { pct: "92%", label: "Value for Money", sub: "9% above national average" },
                { pct: "95%+", label: "Success Rate", sub: "16% above national average" },
                { pct: "95%+", label: "Would Recommend", sub: "17% above national average" },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-gray-100 rounded-xl px-5 py-4 text-center shadow-sm min-w-[140px]">
                  <p className="text-xl font-bold text-[#1a3a4a]">{s.pct}</p>
                  <p className="text-sm font-semibold text-gray-700 mt-1">{s.label}</p>
                  <p className="text-xs text-[#3a9e4f] mt-1">↑ {s.sub}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="max-w-2xl mx-auto">
            {willsReviews.map((r) => (
              <div key={r.name} className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                <div className="flex text-[#3a9e4f] text-xl mb-3">{"★★★★★"}</div>
                <p className="font-semibold text-[#1a3a4a] text-lg mb-3">"{r.title}"</p>
                <p className="text-gray-600 leading-relaxed mb-4">"{r.body}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0e7490] flex items-center justify-center text-white font-bold">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a3a4a] text-sm">{r.name}</p>
                    <p className="text-xs text-[#3a9e4f] font-medium">✓ Verified · {r.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                title: "Book a Free Call",
                body: "Tell us about your situation. We'll listen, answer your questions, and explain exactly what needs to happen next.",
              },
              {
                step: "2",
                title: "We Handle the Paperwork",
                body: "From applying for the Grant of Probate to managing HMRC forms, creditors, and asset distribution — we take care of everything.",
              },
              {
                step: "3",
                title: "You Get Peace of Mind",
                body: "We keep you updated at every stage. No surprises on fees or timelines.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#0e7490] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-[#1a3a4a] text-lg mb-2">{s.title}</h3>
                <p className="text-gray-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <section className="py-14 px-4 bg-[#0e7490] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Not Sure What You Need?</h2>
          <p className="text-lg text-teal-100 mb-6">Take Our Free 2-Minute Assessment</p>
          <button
            data-testid="mid-cta-wills"
            onClick={() => setLocation("/wills-and-probate/quiz")}
            className="bg-white text-[#0e7490] font-bold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Start My Free Assessment →
          </button>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {[
              { label: "SRA Regulated", sub: "SRA No: 800525" },
              { label: "Local to Carlisle", sub: "Cumbrian solicitors" },
              { label: "Fixed-Fee", sub: "No hidden costs" },
            ].map((t) => (
              <div key={t.label} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#0e7490] flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-bold text-[#1a3a4a]">{t.label}</p>
                <p className="text-sm text-gray-500">{t.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3a4a] text-center mb-10">Common Questions</h2>
          {faqs.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-[#1a3a4a] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">You Don't Have To Deal With This Alone</h2>
          <a
            href="tel:01228272395"
            data-testid="final-cta-phone"
            className="block text-3xl font-bold text-[#5eead4] hover:text-white transition-colors mb-6"
          >
            01228 272395
          </a>
          <button
            data-testid="final-cta-quiz"
            onClick={() => setLocation("/wills-and-probate/quiz")}
            className="bg-[#0e7490] hover:bg-[#0a5a70] text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            Start My Free Assessment →
          </button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
