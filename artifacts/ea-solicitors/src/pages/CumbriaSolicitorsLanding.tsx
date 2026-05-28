import { useLocation } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useState } from "react";
import { useAdParam } from "@/hooks/useAdParam";
import { useSeoMeta } from "@/hooks/useSeoMeta";

const reviews = [
  {
    name: "Joel Maloney",
    verified: true,
    date: "6 Nov 2024",
    title: "Outstanding Service and Professional Support",
    body: "I recently had the pleasure of working with Edward & Amaury in Carlisle, and I couldn't be more impressed. From the start, they took the time to listen to my concerns and provided clear, sound advice tailored to my situation. I felt fully supported throughout and would highly recommend them to anyone in need of reliable, professional legal assistance.",
  },
  {
    name: "Sally Grisedale",
    verified: true,
    date: "8 Jun 2025",
    title: "Highly Recommend Edward & Amaury Solicitors",
    body: "I cannot recommend Edward & Amaury highly enough. My experience was exceptional. Their knowledge was vast and incredibly impressive. They expertly guided me through an intricate process, making what could have been a daunting task feel manageable and clear. Outstanding service, at a very reasonable price.",
  },
  {
    name: "LS & SM",
    verified: true,
    date: "29 May 2025",
    title: "An Outstanding Service",
    body: "From the first meeting it was clear they are very knowledgeable. From a human perspective, they treated us with such grace, kindness and understanding that we would never use any other law firm. If you need peace of mind and a cost-effective service, please use Edward and Amaury.",
  },
  {
    name: "Carl",
    verified: false,
    date: "15 Dec 2025",
    title: "Very professional from start to finish",
    body: "Very professional from start to finish, took the strain and time away from me trying to sort this issue out.",
  },
  {
    name: "Fra Markham",
    verified: true,
    date: "18 Dec 2025",
    title: "Professional and knowledgeable",
    body: "Edward and Amaury were professional and had the knowledge to achieve the very specific goal we had. As our circumstances were out of the normal it was good that they knew how to face the unique challenges.",
  },
  {
    name: "Em",
    verified: false,
    date: "31 Jul 2024",
    title: "Excellent",
    body: "Perfect service from the initial consultation throughout. Knowledgeable, attentive, involved, easy to communicate with. Dealt with my case in a timely and professional manner. I would highly recommend their services. Humane and professional approach up until the very end.",
  },
];

const services = [
  {
    title: "Wills & Probate",
    body: "Helping families through estate administration, probate, and intestacy. Fixed-fee, with full guidance from the first call.",
  },
  {
    title: "Will Writing",
    body: "Single wills, mirror wills, and more complex estate planning. Drafted properly, signed properly, stored safely.",
  },
  {
    title: "UK Spouse & Family Visas",
    body: "Cumbria's only dedicated immigration solicitors. Specialists in spouse visas, fiance visas, and family route applications.",
  },
  {
    title: "Personal Injury",
    body: "Road traffic, accident at work, and other personal injury claims. Straightforward advice on whether you have a claim and what it could be worth.",
  },
];

const faqs = [
  {
    q: "Where are you based?",
    a: "We are based in Carlisle, Cumbria, and act for clients across the county and further afield. Most work can be handled by phone and email. Face-to-face appointments at our office are available when preferred.",
  },
  {
    q: "Are you regulated?",
    a: "Yes. Edward & Amaury Solicitors is authorised and regulated by the Solicitors Regulation Authority (SRA No. 800525).",
  },
  {
    q: "How do your fees work?",
    a: "We work on a fixed-fee basis wherever possible. You will know what you are paying before any work begins. The exact fee is discussed during your initial call once we understand what you need.",
  },
  {
    q: "Will I have a named solicitor on my case?",
    a: "Yes. Every client gets a named solicitor responsible for their matter. You will not be passed around a call centre or speak to a different person every time.",
  },
  {
    q: "How quickly will you respond?",
    a: "We aim to call you back within one working day of your enquiry. If your matter is urgent, please mention this when you call so we can prioritise it.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="w-full text-left flex justify-between items-center gap-4 font-semibold text-[#1a3a4a] hover:text-[#0e7490] transition-colors"
        onClick={() => setOpen(!open)}
        data-testid={`faq-toggle-cumbria-${q.slice(0, 15).replace(/\s/g, "-").toLowerCase()}`}
      >
        <span>{q}</span>
        <span className="text-xl flex-shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="mt-3 text-gray-600 leading-relaxed">{a}</p>}
    </div>
  );
}

function TriageStub({ testId }: { testId: string }) {
  const [opened, setOpened] = useState(false);
  if (opened) {
    return (
      <p className="mt-4 text-sm text-gray-200 max-w-md mx-auto" data-testid={`${testId}-notice`}>
        Our quick triage is launching shortly. For now, please call{" "}
        <a href="tel:+441228272395" className="underline font-semibold text-[#5eead4]">
          01228 272395
        </a>{" "}
        and we will point you in the right direction.
      </p>
    );
  }
  return (
    <button
      data-testid={testId}
      onClick={() => setOpened(true)}
      className="mt-4 text-sm text-[#5eead4] hover:text-white underline underline-offset-4 transition-colors"
    >
      Or take our 60-second triage →
    </button>
  );
}

export default function CumbriaSolicitorsLanding() {
  const [, setLocation] = useLocation();
  const adHeadline = useAdParam("h1", "Looking for a Solicitor in Cumbria?");
  const adSub = useAdParam(
    "sub",
    "Edward & Amaury Solicitors. Carlisle-based. SRA-regulated. A named solicitor on every case."
  );
  const adBody = useAdParam(
    "body",
    "We help people across Cumbria with wills and probate, will writing, UK spouse and family visas, and personal injury claims. Plain English, fixed fees, no call centre."
  );
  useSeoMeta(
    "Solicitors in Carlisle & Cumbria — Edward & Amaury",
    "Looking for a solicitor in Cumbria? Edward & Amaury Solicitors. Carlisle office. Fixed fees, named solicitor on every case. Call 01228 272395."
  );

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-[#1a3a4a] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            {adHeadline}
          </h1>
          <p className="text-xl text-[#5eead4] font-semibold mb-6">{adSub}</p>
          <p className="text-gray-200 text-lg max-w-3xl mx-auto mb-8">{adBody}</p>
          <a
            href="tel:+441228272395"
            data-testid="hero-cta-cumbria-phone"
            className="inline-block bg-[#0e7490] hover:bg-[#0a5a70] text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
          >
            Call 01228 272395
          </a>
          <div className="mt-2">
            <TriageStub testId="hero-cta-cumbria-triage" />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-300">
            {["SRA Regulated", "Carlisle Office", "Fixed Fees", "Named Solicitor", "Free First Call"].map((t) => (
              <span key={t} className="flex items-center gap-1">
                <span className="text-[#5eead4]">✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3a4a] text-center mb-6">
            Why People Across Cumbria Choose Us
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed text-center mb-12 max-w-3xl mx-auto">
            Choosing a solicitor is a decision most people make once every few years. We make it easy. One firm, one named solicitor on your case, fixed fees agreed up front, and an answer when you ring.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Carlisle-Based, Cumbria-Focused", body: "Our office is on Carlisle. We act for clients across Cumbria, the Lake District, and the Borders." },
              { title: "A Named Solicitor", body: "You will deal with the same solicitor from first call to file close. No being passed around a team." },
              { title: "Fixed Fees, No Surprises", body: "We agree the fee before any work begins. You will know exactly what it costs to take the next step." },
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

      {/* Services */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3a4a] text-center mb-3">
            What We Help With
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Four core practice areas. If your matter falls outside these, we will tell you on the first call and, where we can, point you to a trusted local firm who can help.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((s) => (
              <div key={s.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#1a3a4a] text-lg mb-2">{s.title}</h3>
                <p className="text-gray-600 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
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
                <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-center shadow-sm min-w-[140px]">
                  <p className="text-xl font-bold text-[#1a3a4a]">{s.pct}</p>
                  <p className="text-sm font-semibold text-gray-700 mt-1">{s.label}</p>
                  <p className="text-xs text-[#3a9e4f] mt-1">↑ {s.sub}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div key={r.name + r.date} className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-[#0e7490] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a3a4a] text-sm leading-tight">{r.name}</p>
                    {r.verified && <p className="text-xs text-[#3a9e4f] font-medium">✓ Verified</p>}
                  </div>
                </div>
                <div className="flex text-[#3a9e4f] text-base my-2">{"★★★★★"}</div>
                <p className="font-semibold text-[#1a3a4a] text-sm mb-2">{r.title}</p>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">{r.body}</p>
                <p className="text-xs text-gray-400 mt-3">{r.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3a4a] text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Call or Triage", body: "Ring us on 01228 272395, or use our quick online triage to tell us what you need." },
              { step: "2", title: "Free First Call", body: "We listen, give straight advice on whether we can help, and quote a fixed fee for the next step." },
              { step: "3", title: "Named Solicitor", body: "If you would like us to act, you are matched with a named solicitor who handles your matter from start to finish." },
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

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3a4a] text-center mb-10">Common Questions</h2>
          {faqs.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-[#0e7490] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Speak to a Solicitor Today</h2>
          <p className="text-teal-100 text-lg mb-6">Free first call. No obligation. Honest advice on whether we are the right firm for you.</p>
          <a
            href="tel:+441228272395"
            data-testid="final-cta-cumbria-phone"
            className="block text-3xl font-bold text-white hover:text-[#1a3a4a] transition-colors mb-6"
          >
            01228 272395
          </a>
          <TriageStub testId="final-cta-cumbria-triage" />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
