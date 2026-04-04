import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16">
        <h1 className="text-3xl font-bold text-[#1a3a4a] mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Edward &amp; Amaury Ltd</p>

        <div className="prose prose-gray max-w-none text-gray-700 text-sm sm:text-base leading-relaxed space-y-8">

          <p>
            Edward &amp; Amaury Ltd (referred to as "we", "us" and "our" in this privacy policy) respect your privacy
            and are committed to protecting your personal data. This privacy policy will inform you as to how we look
            after your personal data when you visit our website and tell you about your privacy rights and how the law
            protects you.
          </p>

          <nav className="bg-gray-50 rounded-xl p-5 space-y-1">
            <p className="font-semibold text-[#1a3a4a] mb-3">Contents</p>
            {[
              "Important Information and Who We Are",
              "The Data We Collect About You",
              "How Is Your Personal Data Collected?",
              "How We Use Your Personal Data",
              "Data Security",
              "Data Retention",
              "Your Legal Rights",
              "Glossary",
            ].map((item, i) => (
              <p key={i}>
                <a href={`#section-${i + 1}`} className="text-[#0e7490] hover:underline">
                  {i + 1}. {item}
                </a>
              </p>
            ))}
          </nav>

          <section id="section-1">
            <h2 className="text-xl font-bold text-[#1a3a4a] mb-3">1. Important Information and Who We Are</h2>

            <h3 className="font-semibold text-[#1a3a4a] mb-2">Purpose of This Privacy Policy</h3>
            <p>
              This privacy policy aims to give you information on how Edward &amp; Amaury Ltd collects and processes
              your personal data through your use of this website, including any data you may provide through this
              website when you complete a legal enquiry form. This website is not intended for children and we do not
              knowingly collect data relating to children.
            </p>
            <p className="mt-3">
              It is important that you read this privacy policy together with any other privacy policy or fair
              processing policy we may provide on specific occasions when we are collecting or processing personal data
              about you so that you are fully aware of how and why we are using your data.
            </p>

            <h3 className="font-semibold text-[#1a3a4a] mt-5 mb-2">Third-Party Links</h3>
            <p>
              This website may include links to third-party websites, plug-ins and applications. Clicking on those
              links or enabling those connections may allow third parties to collect or share data about you. We do not
              control these third-party websites and are not responsible for their privacy statements. When you leave
              our website, we encourage you to read the privacy policy of every website you visit.
            </p>
          </section>

          <section id="section-2">
            <h2 className="text-xl font-bold text-[#1a3a4a] mb-3">2. The Data We Collect About You</h2>
            <p>
              Personal data means any information about an individual from which that person can be identified. We may
              collect, use, store and transfer different kinds of personal data about you, grouped as follows:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li><strong>Identity Data</strong> — first name, last name, title.</li>
              <li><strong>Contact Data</strong> — email address and telephone numbers.</li>
              <li>
                <strong>Technical Data</strong> — internet protocol (IP) address, browser type and version, time zone
                setting and location, browser plug-in types and versions, operating system and platform, and other
                technology on the devices you use to access this website.
              </li>
              <li><strong>Usage Data</strong> — information about how you use our website, products and services.</li>
              <li>
                <strong>Marketing and Communications Data</strong> — your preferences in receiving marketing from us.
              </li>
            </ul>
            <p className="mt-3">
              We do not collect any Special Categories of Personal Data about you (this includes details about your
              race or ethnicity, religious or philosophical beliefs, sex life, sexual orientation, political opinions,
              trade union membership, information about your health, and genetic and biometric data), nor any
              information about criminal convictions and offences.
            </p>
          </section>

          <section id="section-3">
            <h2 className="text-xl font-bold text-[#1a3a4a] mb-3">3. How Is Your Personal Data Collected?</h2>
            <p>We use different methods to collect data from and about you including through:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>Direct interactions.</strong> You may give us your Identity and Contact Data by filling in the
                enquiry forms on this website, or by corresponding with us by phone or email. This includes personal
                data you provide when you submit a legal enquiry or request a call-back.
              </li>
              <li>
                <strong>Automated technologies or interactions.</strong> As you interact with our website, we will
                automatically collect Technical Data about your equipment, browsing actions and patterns. We collect
                this personal data by using cookies and similar technologies.
              </li>
              <li>
                <strong>Third parties or publicly available sources.</strong> We may receive Technical Data from
                analytics providers such as Google (based outside the UK/EU), and advertising platforms such as Google
                Ads.
              </li>
            </ul>
          </section>

          <section id="section-4">
            <h2 className="text-xl font-bold text-[#1a3a4a] mb-3">4. How We Use Your Personal Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal
              data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>
                Where it is necessary for our legitimate interests (or those of a third party) and your interests and
                fundamental rights do not override those interests.
              </li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>

            <div className="overflow-x-auto mt-5">
              <table className="w-full border border-gray-200 text-xs sm:text-sm">
                <thead className="bg-[#1a3a4a] text-white">
                  <tr>
                    <th className="text-left px-3 py-2 w-1/3">Purpose / Activity</th>
                    <th className="text-left px-3 py-2 w-1/3">Type of Data</th>
                    <th className="text-left px-3 py-2 w-1/3">Lawful Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    {
                      purpose: "To handle your legal enquiry and contact you",
                      data: "Identity; Contact",
                      basis: "Performance of a contract with you; Legitimate interests",
                    },
                    {
                      purpose: "To manage our relationship with you and notify you of changes",
                      data: "Identity; Contact; Marketing and Communications",
                      basis: "Performance of a contract; Legal obligation; Legitimate interests",
                    },
                    {
                      purpose: "To administer and protect our website",
                      data: "Identity; Contact; Technical",
                      basis: "Legitimate interests; Legal obligation",
                    },
                    {
                      purpose: "To deliver relevant website content and measure advertising effectiveness",
                      data: "Identity; Contact; Usage; Technical",
                      basis: "Legitimate interests",
                    },
                    {
                      purpose: "To use data analytics to improve our website and marketing",
                      data: "Technical; Usage",
                      basis: "Legitimate interests",
                    },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-3 py-2 align-top">{row.purpose}</td>
                      <td className="px-3 py-2 align-top">{row.data}</td>
                      <td className="px-3 py-2 align-top">{row.basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="font-semibold text-[#1a3a4a] mt-5 mb-2">Cookies</h3>
            <p>
              You can set your browser to refuse all or some browser cookies, or to alert you when websites set or
              access cookies. If you disable or refuse cookies, please note that some parts of this website may become
              inaccessible or not function properly. This site uses Google reCAPTCHA to protect against automated
              submissions; use of reCAPTCHA is subject to Google's Privacy Policy and Terms of Service.
            </p>
          </section>

          <section id="section-5">
            <h2 className="text-xl font-bold text-[#1a3a4a] mb-3">5. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally
              lost, used or accessed in an unauthorised way, altered or disclosed. We limit access to your personal
              data to those employees, agents, contractors and other third parties who have a business need to know.
              They will only process your personal data on our instructions and are subject to a duty of
              confidentiality.
            </p>
            <p className="mt-3">
              We have put in place procedures to deal with any suspected personal data breach and will notify you and
              any applicable regulator of a breach where we are legally required to do so.
            </p>
          </section>

          <section id="section-6">
            <h2 className="text-xl font-bold text-[#1a3a4a] mb-3">6. Data Retention</h2>
            <p>
              We will only retain your personal data for as long as reasonably necessary to fulfil the purposes we
              collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or
              reporting requirements.
            </p>
            <p className="mt-3">
              By law we have to keep basic information about our clients (including Contact, Identity, Financial and
              Transaction Data) for six years after they cease being clients. In some circumstances you can ask us to
              delete your data: see Your Legal Rights below for further information.
            </p>
          </section>

          <section id="section-7">
            <h2 className="text-xl font-bold text-[#1a3a4a] mb-3">7. Your Legal Rights</h2>
            <p>Under data protection laws you have rights including:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>Request access</strong> to your personal data (a "data subject access request") — to receive a
                copy of the personal data we hold about you.
              </li>
              <li>
                <strong>Request correction</strong> of the personal data that we hold about you.
              </li>
              <li>
                <strong>Request erasure</strong> of your personal data where there is no good reason for us continuing
                to process it.
              </li>
              <li>
                <strong>Object to processing</strong> of your personal data where we are relying on a legitimate
                interest.
              </li>
              <li>
                <strong>Request restriction</strong> of processing of your personal data.
              </li>
              <li>
                <strong>Request transfer</strong> of your personal data to you or a third party in a structured,
                commonly used, machine-readable format.
              </li>
              <li>
                <strong>Withdraw consent</strong> at any time where we are relying on consent to process your personal
                data.
              </li>
            </ul>
            <p className="mt-4">
              If you wish to exercise any of the rights set out above, please contact us at{" "}
              <a href="mailto:nadeem@edwardamaury.co.uk" className="text-[#0e7490] hover:underline">
                nadeem@edwardamaury.co.uk
              </a>{" "}
              or call <a href="tel:01228272395" className="text-[#0e7490] hover:underline">01228 272395</a>.
            </p>
            <p className="mt-3">
              You also have the right to make a complaint at any time to the Information Commissioner's Office (ICO),
              the UK supervisory authority for data protection issues (
              <a href="https://www.ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-[#0e7490] hover:underline">
                www.ico.org.uk
              </a>
              ).
            </p>
          </section>

          <section id="section-8">
            <h2 className="text-xl font-bold text-[#1a3a4a] mb-3">8. Glossary</h2>
            <dl className="space-y-4">
              <div>
                <dt className="font-semibold">Legitimate Interest</dt>
                <dd className="mt-1">
                  The interest of our business in conducting and managing our business to enable us to give you the
                  best service and the most secure experience.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Performance of Contract</dt>
                <dd className="mt-1">
                  Processing your data where it is necessary for the performance of a contract to which you are a
                  party, or to take steps at your request before entering into such a contract.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Comply with a Legal Obligation</dt>
                <dd className="mt-1">
                  Processing your personal data where it is necessary for compliance with a legal obligation that we
                  are subject to.
                </dd>
              </div>
            </dl>
          </section>

          <div className="border-t border-gray-200 pt-6 text-xs text-gray-400">
            <p>Edward &amp; Amaury Ltd is authorised and regulated by the Solicitors Regulation Authority (SRA No: 800525).</p>
            <p className="mt-1">Registered in England and Wales. Carlisle, Cumbria.</p>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
