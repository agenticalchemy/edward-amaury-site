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
