import { useLocation } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useState } from "react";
import { useAdHeadline } from "@/hooks/useAdHeadline";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useOgMeta } from "@/hooks/useOgMeta";
import { useJsonLd } from "@/hooks/useJsonLd";

const faqs = [
  {
    q: "How long do I have to make a personal injury claim?",
    a: "In most cases you have two years from the date of the accident or the date you became aware of the injury. We use two years (not three) because realistic case preparation needs time. If you're approaching that window, call us today rather than wait.",
  },
  {
    q: "What does no win no fee actually mean?",
    a: "No win no fee means you pay nothing upfront and pay nothing if your claim is unsuccessful. If we win, a fee is deducted from your compensation. We'll explain the exact terms during your free initial assessment so there are no surprises.",
  },
  {
    q: "How much compensation could I receive?",
    a: "Compensation depends on the severity of your injury, how it has affected your life, and any financial losses (lost earnings, medical costs, future care). We'll give you a realistic indication after reviewing your case.",
  },
  {
    q: "Will I have to go to court?",
    a: "The vast majority of personal injury claims settle without ever going to court. Insurers usually want to resolve cases quickly. If court does become necessary, we'll prepare you fully and represent you throughout.",
  },
  {
    q: "What if the accident was partly my fault?",
    a: "You may still be able to claim. Compensation can be reduced proportionally based on shared responsibility, but a partial claim is often still worthwhile. Don't write yourself off without a conversation first.",
  },
  {
    q: "How long do claims typically take?",
    a: "Straightforward claims often settle within 6-9 months. More complex cases (serious injuries, disputed liability, ongoing treatment) can take 12-24 months. We'll give you an honest timeline based on your specific situation.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="w-full text-left flex justify-between items-center gap-4 font-semibold text-[#1a3a4a] hover:text-[#0e7490] transition-colors"
        onClick={() => setOpen(!open)}
        data-testid={`faq-toggle-pi-${q.slice(0, 15).replace(/\s/g, "-").toLowerCase()}`}
      >
        <span>{q}</span>
        <span className="text-xl flex-shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="mt-3 text-gray-600 leading-relaxed">{a}</p>}
    </div>
  );
}

const PI_PAGE_TITLE = "Personal Injury Solicitors in Carlisle, Cumbria — Edward & Amaury";
const PI_PAGE_DESCRIPTION = "No win no fee personal injury solicitors in Carlisle. Free 2-minute claim assessment. Call 01228 272395.";

export default function PersonalInjuryLanding() {
  const [, setLocation] = useLocation();
  const adHeadline = useAdHeadline("");
  useSeoMeta(PI_PAGE_TITLE, PI_PAGE_DESCRIPTION);
  useOgMeta({ title: PI_PAGE_TITLE, description: PI_PAGE_DESCRIPTION });

  useJsonLd("pi-legal-service", {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "Edward & Amaury Solicitors",
    description: "Personal injury solicitors in Carlisle, Cumbria. No win no fee.",
    url: "https://edwardamaurysolicitors.co.uk/personal-injury",
    telephone: "+44-1228-272395",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Carlisle",
      addressRegion: "Cumbria",
      addressCountry: "GB",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Cumbria" },
      { "@type": "City", name: "Carlisle" },
    ],
    identifier: {
      "@type": "PropertyValue",
      name: "SRA Number",
      value: "800525",
    },
    priceRange: "No win no fee",
    serviceType: "Personal injury claims",
  });

  useJsonLd("pi-faq", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-[#1a3a4a] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            {adHeadline || "Injured Through Someone Else's Fault?"}
          </h1>
          <p className="text-xl text-[#5eead4] font-semibold mb-6">
            Find out in 2 minutes whether you have a claim — with no obligation and no upfront cost.
          </p>
          <p className="text-gray-200 text-lg max-w-3xl mx-auto mb-8">
            Road accident, accident at work, slip or trip, medical negligence — if it wasn't your fault, you may be entitled to compensation. Our Carlisle-based solicitors handle Cumbria personal injury claims on a no win no fee basis.
          </p>
          <button
            data-testid="hero-cta-pi"
            onClick={() => setLocation("/personal-injury/quiz")}
            className="bg-[#0e7490] hover:bg-[#0a5a70] text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
          >
            Check My Claim →
          </button>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-300">
            {["SRA Regulated", "No Win No Fee", "Free Assessment", "Carlisle-Based", "Local Solicitor on Every File"].map((t) => (
              <span key={t} className="flex items-center gap-1">
                <span className="text-[#5eead4]">✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Empathy / USPs */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3a4a] text-center mb-6">
            Why Choose a Local Cumbria Solicitor?
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed text-center mb-12 max-w-3xl mx-auto">
            National personal injury firms pass your case around call centres. Your file gets handled by whoever picks up. At Edward & Amaury, you speak to a named solicitor in Carlisle who handles your case from start to finish.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Carlisle-Based", body: "Walk-in office in Carlisle. Meet the solicitor handling your case. No call centres." },
              { title: "No Win No Fee", body: "You pay nothing upfront. If we don't win, you don't pay. Free initial assessment." },
              { title: "SRA Regulated", body: "Fully authorised and regulated by the Solicitors Regulation Authority. SRA No: 800525." },
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

      {/* Trust panel */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center mb-2">
            <img src="/review-solicitors-logo.png" alt="Review Solicitors" className="h-10 mb-5" />
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl font-bold text-[#1a3a4a]">4.9</span>
              <div>
                <p className="font-bold text-[#1a3a4a] text-lg leading-tight">Excellent</p>
                <div className="flex text-[#3a9e4f] text-2xl leading-none">{"★★★★★"}</div>
                <p className="text-sm text-[#3a9e4f] font-medium underline">60+ Reviews</p>
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
        </div>
      </section>

      {/* Types of claim */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3a4a] text-center mb-10">
            Types of Claim We Handle
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Road Traffic Accidents", body: "Car, motorcycle, cycling, or pedestrian accidents on Cumbria's roads — including the A66, A595, A69, and M6." },
              { title: "Accidents at Work", body: "Workplace injuries caused by employer negligence, faulty equipment, or unsafe conditions." },
              { title: "Slips, Trips & Falls", body: "Injuries in shops, public spaces, hospitality venues, or on pavements that weren't properly maintained." },
              { title: "Medical Negligence", body: "Misdiagnosis, surgical errors, or substandard care from NHS or private healthcare providers." },
              { title: "Dog Bites & Animal Attacks", body: "Injuries caused by uncontrolled or aggressive animals where the owner failed in their duty of care." },
              { title: "Public Liability Claims", body: "Injuries on someone else's property or in public spaces where reasonable safety wasn't maintained." },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#1a3a4a] text-lg mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{card.body}</p>
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
              { step: "1", title: "Take the Assessment", body: "Answer 5 quick questions about your accident. Takes under 2 minutes." },
              { step: "2", title: "Get Your Results", body: "We tell you straight whether you have a claim worth pursuing — and what to expect next." },
              { step: "3", title: "Speak to a Solicitor", body: "A Carlisle-based personal injury solicitor will call you within 24 hours to discuss your case." },
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

      {/* Mid CTA */}
      <section className="py-14 px-4 bg-[#0e7490] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Check Your Claim Now</h2>
          <p className="text-teal-100 text-lg mb-6">Free, confidential, no obligation</p>
          <button
            data-testid="mid-cta-pi"
            onClick={() => setLocation("/personal-injury/quiz")}
            className="bg-white text-[#0e7490] font-bold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Check My Claim →
          </button>
        </div>
      </section>

      {/* Time matters */}
      <section className="py-16 px-4 bg-[#1a3a4a] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Time Matters in Personal Injury Claims</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { stat: "2 Years", label: "The window for most personal injury claims" },
              { stat: "Fresh", label: "Memory and evidence is strongest in the first few months" },
              { stat: "Witnesses", label: "Get harder to track down as time passes" },
            ].map((item) => (
              <div key={item.stat} className="bg-white/10 rounded-xl p-6">
                <p className="text-3xl font-bold text-[#5eead4] mb-2">{item.stat}</p>
                <p className="text-gray-200 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-gray-300 text-lg">
            Don't let delay weaken your claim. A 2-minute assessment now tells you where you stand.
          </p>
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
      <section className="py-16 px-4 bg-[#0e7490] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Don't Leave Your Claim to Chance</h2>
          <a
            href="tel:+441228272395"
            data-testid="final-cta-pi-phone"
            className="block text-3xl font-bold text-white hover:text-[#1a3a4a] transition-colors mb-6"
          >
            01228 272395
          </a>
          <button
            data-testid="final-cta-pi-quiz"
            onClick={() => setLocation("/personal-injury/quiz")}
            className="bg-[#1a3a4a] hover:bg-[#0f2535] text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            Check My Claim →
          </button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
