import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
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

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Redirect to="/wills-and-probate" />
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
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
