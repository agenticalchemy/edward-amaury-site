import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import WillsLanding from "@/pages/WillsLanding";
import WillsQuiz from "@/pages/WillsQuiz";
import WillsThankYou from "@/pages/WillsThankYou";
import VisaLanding from "@/pages/VisaLanding";
import VisaQuiz from "@/pages/VisaQuiz";
import VisaThankYou from "@/pages/VisaThankYou";
import WillWritingLanding from "@/pages/WillWritingLanding";
import WillWritingQuiz from "@/pages/WillWritingQuiz";
import WillWritingThankYou from "@/pages/WillWritingThankYou";
import CumbriaSolicitorsLanding from "@/pages/CumbriaSolicitorsLanding";
import PersonalInjuryLanding from "@/pages/PersonalInjuryLanding";
import PersonalInjuryQuiz from "@/pages/PersonalInjuryQuiz";
import PersonalInjuryThankYou from "@/pages/PersonalInjuryThankYou";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import { firePhoneClickEvent } from "@/lib/tracking";

const queryClient = new QueryClient();

// Track every click on a tel: link anywhere in the app. A single document-level
// listener covers all 20+ phone links (header, landing pages, footers) and any
// added later, without wiring up each one individually.
function PhoneClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.('a[href^="tel:"]');
      if (!anchor) return;
      try {
        firePhoneClickEvent(window.location.pathname);
      } catch {
        /* tracking must never break the call */
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}

// Reset scroll to the top on every route change. Without this, navigating
// between pages (e.g. a service card -> /uk-spouse-visa) keeps the previous
// scroll position and lands the visitor partway down the new page.
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Redirect to="/cumbria-solicitors" />
      </Route>
      <Route path="/wills-and-probate" component={WillsLanding} />
      <Route path="/wills-and-probate/quiz" component={WillsQuiz} />
      <Route path="/wills-and-probate/thank-you" component={WillsThankYou} />
      <Route path="/uk-spouse-visa" component={VisaLanding} />
      <Route path="/uk-spouse-visa/quiz" component={VisaQuiz} />
      <Route path="/uk-spouse-visa/thank-you" component={VisaThankYou} />
      <Route path="/will-writing" component={WillWritingLanding} />
      <Route path="/will-writing/quiz" component={WillWritingQuiz} />
      <Route path="/will-writing/results" component={WillWritingThankYou} />
      <Route path="/cumbria-solicitors" component={CumbriaSolicitorsLanding} />
      <Route path="/personal-injury" component={PersonalInjuryLanding} />
      <Route path="/personal-injury/quiz" component={PersonalInjuryQuiz} />
      <Route path="/personal-injury/thank-you" component={PersonalInjuryThankYou} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <ScrollToTop />
          <PhoneClickTracker />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
