import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { fireWillWritingEvent } from "@/lib/tracking";

type WillWritingRoute = "no-will" | "outdated" | "review";

interface ResultsState {
  firstName?: string;
  route?: WillWritingRoute;
  q2Selections?: string[];
  q3Selections?: string[];
}

function has(list: string[] | undefined, keyword: string): boolean {
  return (list ?? []).some((s) => s.toLowerCase().includes(keyword.toLowerCase()));
}

function NoWillResults({ firstName, q3 }: { firstName: string; q3: string[] }) {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1a3a4a] mb-4 leading-tight">
        {firstName}, right now the law decides what happens to your family — not you
      </h1>
      <p className="text-gray-600 leading-relaxed mb-6">
        You're in the same position as 56% of UK adults. Without a will, a fixed set of rules called the intestacy laws decides who inherits, who looks after your children, and what happens to your home. Your wishes don't come into it.
      </p>

      {has(q3, "partner but we're not married") && (
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-4">
          <p className="font-semibold text-[#1a3a4a] mb-1">Your partner inherits nothing</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Under intestacy law, an unmarried partner has no automatic right to inherit — no matter how long you've been together, no matter how much you've contributed to the home. Only marriage or a civil partnership creates that right.
          </p>
        </div>
      )}

      {has(q3, "children under 18") && (
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-4">
          <p className="font-semibold text-[#1a3a4a] mb-1">A judge decides who raises your children</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Without a will, there is no legal guardian appointment. Under the Children Act 1989, the court decides — and it may not be who you'd choose.
          </p>
        </div>
      )}

      {has(q3, "own property") && (
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-4">
          <p className="font-semibold text-[#1a3a4a] mb-1">Your home may not go where you think</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            If you own it solely, it falls into your estate and gets distributed under intestacy rules. If you're unmarried, your partner could have no claim to it at all.
          </p>
        </div>
      )}

      {has(q3, "business") && (
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-4">
          <p className="font-semibold text-[#1a3a4a] mb-1">Your business could be paralysed</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Without a will addressing your ownership, nobody may be able to authorise payments, sign contracts, or appoint directors. The business exists on paper but can't function.
          </p>
        </div>
      )}

      {has(q3, "stepchildren") && (
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-4">
          <p className="font-semibold text-[#1a3a4a] mb-1">Your stepchildren inherit nothing</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Unless legally adopted, stepchildren have no automatic right to your estate under intestacy — even if you've raised them as your own.
          </p>
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-5 mb-6 text-sm text-gray-600 leading-relaxed">
        <p className="mb-3">
          Every year, around 2,000 estates in England and Wales pass to the Crown because nobody was legally entitled to inherit. A will is what stops the law from making decisions your family has to live with.
        </p>
        <p>
          The good news: sorting this out is simpler than you think. Most people have their will completed within a week of their first call with us. One appointment. Fixed fee. Done.
        </p>
      </div>
    </>
  );
}

function OutdatedResults({ firstName, q2 }: { firstName: string; q2: string[] }) {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1a3a4a] mb-4 leading-tight">
        {firstName}, your will may no longer protect the people you love
      </h1>
      <p className="text-gray-600 leading-relaxed mb-6">
        You've done the right thing by making a will. But based on what you've told us, things have changed since it was written — and your will may not have kept up.
      </p>

      {has(q2, "married") && (
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-4">
          <p className="font-semibold text-[#1a3a4a] mb-1">Getting married usually cancels your previous will</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Under the Wills Act 1837, your previous will may have been automatically revoked — meaning you could effectively have no will at all right now.
          </p>
        </div>
      )}

      {has(q2, "divorced") && (
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-4">
          <p className="font-semibold text-[#1a3a4a] mb-1">Divorce doesn't cancel your will</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            It treats your ex-spouse as having died for the purpose of gifts and executor appointments, but the rest of the will stays in force. That can leave failed gifts, gaps, and an executor position nobody is filling.
          </p>
        </div>
      )}

      {has(q2, "children") && (
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-4">
          <p className="font-semibold text-[#1a3a4a] mb-1">Children born after your will may not be covered</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            The Law Commission has confirmed that existing law provides limited or no protection to beneficiaries under pre-existing wills. Your newer children may have to make a court claim rather than receive a clear gift.
          </p>
        </div>
      )}

      {has(q2, "property") && (
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-4">
          <p className="font-semibold text-[#1a3a4a] mb-1">Property bought after your will may not be covered</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            If your will doesn't have a strong residuary clause, or the property is held differently than the will assumes, it could fall into partial intestacy.
          </p>
        </div>
      )}

      {has(q2, "business") && (
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-4">
          <p className="font-semibold text-[#1a3a4a] mb-1">Business interests need specialist drafting</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Company shares, articles of association, director succession — the Law Society specifically flags business ownership as a reason to use a solicitor for your will.
          </p>
        </div>
      )}

      {has(q2, "new partner") && (
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-4">
          <p className="font-semibold text-[#1a3a4a] mb-1">Your new partner has no automatic right to inherit</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            If your will still names a previous partner — or doesn't mention your current one — they could be left with nothing.
          </p>
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-5 mb-6 text-sm text-gray-600 leading-relaxed">
        <p className="mb-3">
          GOV.UK and the Law Society both recommend reviewing your will every 5 years minimum, and immediately after any major life event. Based on what you've told us, a review is worth doing now.
        </p>
        <p>
          A will review with us is straightforward — one conversation, a clear quote, and we handle the update. Fixed fee, no surprises.
        </p>
      </div>
    </>
  );
}

function ReviewResults({ firstName }: { firstName: string }) {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1a3a4a] mb-4 leading-tight">
        {firstName}, your will looks current — but here's what most people miss
      </h1>
      <p className="text-gray-600 leading-relaxed mb-6">
        Based on your answers, your will is recent and your circumstances haven't changed dramatically. That's a strong position. But there are a few things that even a well-drafted will can miss.
      </p>

      {[
        {
          title: "Pension and life insurance",
          body: "Most pension schemes pay death benefits based on a nomination form, not your will. If your nominations don't match your will, the money could go somewhere you don't intend.",
        },
        {
          title: "Digital assets",
          body: "Since the Property (Digital Assets etc.) Act 2025, crypto, online accounts, and digital holdings are legally recognised as property. But they're only covered if your will identifies them.",
        },
        {
          title: "Trust protection",
          body: "If your property is held as joint tenants, it passes automatically to the survivor — which could put it at risk if the survivor later needs residential care.",
        },
        {
          title: "Tax efficiency",
          body: "The inheritance tax nil-rate band is frozen at £325,000 until 2030-31. As property values rise, more estates are getting caught. A review can check you're using your full allowances.",
        },
      ].map((item) => (
        <div key={item.title} className="bg-blue-50 border-l-4 border-[#0e7490] rounded-r-xl p-5 mb-4">
          <p className="font-semibold text-[#1a3a4a] mb-1">{item.title}</p>
          <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
        </div>
      ))}

      <div className="bg-gray-50 rounded-xl p-5 mb-6 text-sm text-gray-600 leading-relaxed">
        A periodic will review is a small cost for significant peace of mind. We can check everything's watertight in one short conversation.
      </div>
    </>
  );
}

export default function WillWritingThankYou() {
  const state = (window.history.state?.state ?? {}) as ResultsState;
  const firstName = state.firstName || sessionStorage.getItem("ea_lead_firstname") || "there";
  const route = state.route ?? "no-will";
  const q2 = state.q2Selections ?? [];
  const q3 = state.q3Selections ?? [];

  useEffect(() => {
    fireWillWritingEvent();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />

      <div className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* Confirmation banner */}
          <div className="bg-[#0e7490]/10 border border-[#0e7490]/25 rounded-xl px-5 py-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0e7490] flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-[#1a3a4a] text-sm">Your details have been received</p>
              <p className="text-gray-500 text-xs mt-0.5">A member of our team will call you within 24 hours</p>
            </div>
          </div>

          {/* Results card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {route === "no-will" && <NoWillResults firstName={firstName} q3={q3} />}
            {route === "outdated" && <OutdatedResults firstName={firstName} q2={q2} />}
            {route === "review" && <ReviewResults firstName={firstName} />}
          </div>

          {/* Phone CTA */}
          <a
            href="tel:01228272395"
            data-testid="thankyou-phone-will-writing"
            className="block w-full bg-[#0e7490] hover:bg-[#0a5a70] active:bg-[#084d60] text-white text-center rounded-2xl py-5 px-4 transition-colors shadow-sm"
          >
            <p className="text-xs font-medium text-white/80 mb-1">
              We'll call you within 24 hours — or call us now
            </p>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight">01228 272395</p>
            <p className="text-xs text-white/70 mt-1">Mon–Fri, 9am–5pm</p>
          </a>

          {/* What happens next */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-[#1a3a4a] text-base mb-4">What Happens Next</h2>
            <div className="space-y-4">
              {[
                { n: "1", t: "We review your answers", b: "Our team looks over the details you've shared to prepare for your call." },
                { n: "2", t: "We call you within 24 hours", b: "A Carlisle-based solicitor will call you at a time that suits you." },
                { n: "3", t: "We explain your options clearly", b: "No jargon, no pressure — a plain-speaking conversation about what you need and what it will cost." },
              ].map((item) => (
                <div key={item.n} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#0e7490] text-white flex items-center justify-center font-bold flex-shrink-0 text-xs mt-0.5">
                    {item.n}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a3a4a] text-sm">{item.t}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{item.b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
