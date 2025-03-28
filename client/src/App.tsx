import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import MainLayout from "@/layouts/MainLayout";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Equipment from "@/pages/equipment";
import EquipmentDetails from "@/pages/equipment-details";
import Schedule from "@/pages/schedule";
import WorkOrders from "@/pages/work-orders";
import Staff from "@/pages/staff";
import Reports from "@/pages/reports";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/equipment" component={Equipment} />
      <Route path="/equipment/:id" component={EquipmentDetails} />
      <Route path="/schedule" component={Schedule} />
      <Route path="/work-orders" component={WorkOrders} />
      <Route path="/staff" component={Staff} />
      <Route path="/reports" component={Reports} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MainLayout>
          <Router />
        </MainLayout>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
