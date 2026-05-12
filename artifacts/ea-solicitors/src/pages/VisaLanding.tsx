import { useLocation } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useState } from "react";
import { useAdHeadline } from "@/hooks/useAdHeadline";
import { useSeoMeta } from "@/hooks/useSeoMeta";

const visaReviews = [
  {
    name: "Marleen M.",
    verified: true,
    date: "24 Feb 2026",
    title: "Great advice and support for visa application",
    body: "When applying for my spousal visa on my own I was overwhelmed and received a refusal. My husband and I asked for advice at Edward and Amaury Solicitors and were helped professionally, leading to a successful and fast application. Wishing we had gone there from the start — it would have saved us a lot of stress.",
  },
  {
    name: "LS & SM",
    verified: true,
    date: "29 May 2025",
    title: "An Outstanding Service!",
    body: "Nadeem and his team managed my partner's visa application. From the first meeting it was clear they are very knowledgeable about UK immigration law. From a human perspective, they treated my partner and I with such grace, kindness and understanding that we would never use any other law firm. If you need peace of mind and a cost-effective service, please use Edward and Amaury.",
  },
  {
    name: "Chris Buchanan",
    verified: true,
    date: "12 Sept 2024",
    title: "Outstanding Service",
    body: "I am an American national who recently relocated to the UK with my British wife. We went to Nadeem Pervaz to seek advice on how to obtain a spousal visa. He walked us through all the steps required and total cost. Within 2 months we had my Visa. Thanks Nadeem.",
  },
  {
    name: "Piotr",
    verified: false,
    date: "1 Aug 2025",
    title: "Our Hero!",
    body: "Matthew is absolutely unbelievable. From the first day we met he was so professional and supportive. He helped us so much with our case — without his help my Dad couldn't be with us in the UK. Matthew, we will never forget what you have done for us. You are the best, my friend.",
  },
  {
    name: "Charity",
    verified: false,
    date: "7 Aug 2025",
    title: "Visa Application",
    body: "I am truly grateful to Matthew for the seamless process of my visa application. His expertise and dedication were evident throughout. Thanks to his efforts I am now happily reunited with my family here in the UK. I highly recommend Matthew for his excellent service.",
  },
  {
    name: "Nikola",
    verified: false,
    date: "21 Aug 2024",
    title: "Amazing Experience",
    body: "I had an amazing experience with Mr Matthew, in very difficult circumstances about my immigration status. Matthew did such a great job — he was so professional and helpful, taking care of all details and documents, and finding the best solution in my case. I would highly recommend Mr Matthew and Edward and Amaury Solicitors.",
  },
  {
    name: "Em",
    verified: false,
    date: "31 Jul 2024",
    title: "Excellent",
    body: "Perfect service from the initial consultation throughout. Knowledgeable, attentive, involved, easy to communicate with — Matthew dealt with my case in a timely and professional manner. I would highly recommend his services to anyone who needs legal advice on immigration matters. Humane and professional approach up until the very end.",
  },
];

const faqs = [
  {
    q: "What is the minimum income requirement?",
    a: "For most sponsors, the minimum income threshold is £29,000 per year (before tax). This increased in 2024. However, savings, partner income, and other factors can also be taken into account — we'll assess your full picture.",
  },
  {
    q: "How long does the process take?",
    a: "Once your application is submitted, a decision typically takes 8-12 weeks. Preparation — gathering documents and completing the application correctly — takes additional time. Getting it right first time avoids costly delays.",
  },
  {
    q: "What if my partner doesn't speak English?",
    a: "Your partner will usually need to pass an English language test at CEFR A1 level before applying. Exemptions exist for certain nationalities and age groups. We'll advise you on what applies to your partner.",
  },
  {
    q: "What documents do I need?",
    a: "You'll typically need evidence of your income (payslips, tax returns), suitable accommodation in the UK, and proof of your genuine relationship (photos, messages, travel history, financial links). We'll give you a complete, personalised checklist.",
  },
  {
    q: "How much does it cost to use a solicitor?",
    a: "We work on a fixed-fee basis so there are no surprises. The exact fee is discussed during your free initial consultation, once we understand the full scope of your application.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="w-full text-left flex justify-between items-center gap-4 font-semibold text-[#1a3a4a] hover:text-[#0e7490] transition-colors"
        onClick={() => setOpen(!open)}
        data-testid={`faq-toggle-visa-${q.slice(0, 15).replace(/\s/g, "-").toLowerCase()}`}
      >
        <span>{q}</span>
        <span className="text-xl flex-shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="mt-3 text-gray-600 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function VisaLanding() {
  const [, setLocation] = useLocation();
  const adHeadline = useAdHeadline("");
  useSeoMeta(
    "UK Spouse Visa Solicitors in Carlisle — Edward & Amaury",
    "Expert UK spouse visa and immigration solicitors in Carlisle, Cumbria. Fixed-fee services, free initial assessment. Call 01228 272395."
  );

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-[#1a3a4a] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            {adHeadline || "Could You Bring Your Spouse to the UK?"}
          </h1>
          <p className="text-xl text-[#5eead4] font-semibold mb-6">
            Answer 7 quick questions to find out where you stand — and what your next steps should be.
          </p>
          <p className="text-gray-200 text-lg max-w-3xl mx-auto mb-8">
            The UK spouse visa process is one of the most complex and often most rejected visa applications. That's why we have this free 2-minute assessment to ensure your current situation is eligible — before you spend a penny.
          </p>
          <button
            data-testid="hero-cta-visa"
            onClick={() => setLocation("/uk-spouse-visa/quiz")}
            className="bg-[#0e7490] hover:bg-[#0a5a70] text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
          >
            Check My Eligibility →
          </button>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-300">
            {["SRA Regulated", "Specialist Immigration Team", "Free Assessment", "Confidential", "Cumbria's Only Immigration Firm"].map((t) => (
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
            We Know How Stressful This Process Is
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed text-center mb-12 max-w-3xl mx-auto">
            The income threshold alone rules out half the UK workforce. Add in language tests, accommodation requirements, and mountains of evidence — and it's easy to feel overwhelmed. We help couples navigate every step. No jargon. No guesswork.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Specialist Immigration Team", body: "Our lawyers focus exclusively on UK immigration — including spouse and family visas." },
              { title: "SRA Regulated", body: "Fully authorised and regulated by the Solicitors Regulation Authority. SRA No: 800525." },
              { title: "Cumbria's Only Immigration Firm", body: "Local expertise combined with national immigration knowledge." },
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
                <div key={s.label} className="bg-white border border-gray-100 rounded-xl px-5 py-4 text-center shadow-sm min-w-[140px]">
                  <p className="text-xl font-bold text-[#1a3a4a]">{s.pct}</p>
                  <p className="text-sm font-semibold text-gray-700 mt-1">{s.label}</p>
                  <p className="text-xs text-[#3a9e4f] mt-1">↑ {s.sub}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visaReviews.map((r) => (
              <div key={r.name + r.date} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
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
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3a4a] text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Take the Assessment", body: "Answer 7 questions about your situation. It takes under 2 minutes." },
              { step: "2", title: "Get Your Results", body: "See instantly where you stand — what's working for you and what you need to address." },
              { step: "3", title: "Speak to a Specialist", body: "Our immigration team will call you within 24 hours to discuss your options and next steps." },
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Check Your Eligibility Now</h2>
          <p className="text-teal-100 text-lg mb-6">Free, confidential, no obligation</p>
          <button
            data-testid="mid-cta-visa"
            onClick={() => setLocation("/uk-spouse-visa/quiz")}
            className="bg-white text-[#0e7490] font-bold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Check My Eligibility →
          </button>
        </div>
      </section>

      {/* Why first time matters */}
      <section className="py-16 px-4 bg-[#1a3a4a] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Why Getting It Right First Time Matters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { stat: "£1,846+", label: "Lost in application fees on a refused application" },
              { stat: "Months", label: "Of waiting — only to start over from scratch" },
              { stat: "On record", label: "A refusal stays on your partner's immigration history" },
            ].map((item) => (
              <div key={item.stat} className="bg-white/10 rounded-xl p-6">
                <p className="text-3xl font-bold text-[#5eead4] mb-2">{item.stat}</p>
                <p className="text-gray-200 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-gray-300 text-lg">
            Do not let a preventable mistake cost you time, money, and heartache. Know where you stand before you apply.
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Don't Leave Your Application to Chance</h2>
          <a
            href="tel:+441228272395"
            data-testid="final-cta-visa-phone"
            className="block text-3xl font-bold text-white hover:text-[#1a3a4a] transition-colors mb-6"
          >
            01228 272395
          </a>
          <button
            data-testid="final-cta-visa-quiz"
            onClick={() => setLocation("/uk-spouse-visa/quiz")}
            className="bg-[#1a3a4a] hover:bg-[#0f2535] text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            Check My Eligibility →
          </button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
