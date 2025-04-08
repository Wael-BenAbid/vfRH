import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { queryClient } from "./lib/queryClient";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "./store/authSlice";
import { RootState } from "./store";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import EmployeesPage from "./pages/EmployeesPage";
import LeavePage from "./pages/LeavePage";
import MissionsPage from "./pages/MissionsPage";
import WorkHoursPage from "./pages/WorkHoursPage";
import InternshipsPage from "./pages/InternshipsPage";
import JobApplicationsPage from "./pages/JobApplicationsPage";
import PublicJobApplicationPage from "./pages/PublicJobApplicationPage";
import HomePage from "./pages/HomePage";

// Auth guard component
const PrivateRoute = ({ component: Component, ...rest }: { component: React.ComponentType<any>, path: string }) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex space-x-2">
          <div className="loading-dot w-3 h-3 rounded-full bg-primary"></div>
          <div className="loading-dot w-3 h-3 rounded-full bg-primary"></div>
          <div className="loading-dot w-3 h-3 rounded-full bg-primary"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Component {...rest} />;
};

function Router() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus() as any);
  }, [dispatch]);

  return (
    <Switch>
      {/* Pages publiques */}
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/postuler" component={PublicJobApplicationPage} />
      
      {/* Pages privées */}
      <Route path="/dashboard">
        <PrivateRoute component={DashboardPage} path="/dashboard" />
      </Route>
      
      <Route path="/employees">
        <PrivateRoute component={EmployeesPage} path="/employees" />
      </Route>
      
      <Route path="/leave">
        <PrivateRoute component={LeavePage} path="/leave" />
      </Route>
      
      <Route path="/missions">
        <PrivateRoute component={MissionsPage} path="/missions" />
      </Route>
      
      <Route path="/work-hours">
        <PrivateRoute component={WorkHoursPage} path="/work-hours" />
      </Route>
      
      <Route path="/internships">
        <PrivateRoute component={InternshipsPage} path="/internships" />
      </Route>
      
      <Route path="/job-applications">
        <PrivateRoute component={JobApplicationsPage} path="/job-applications" />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
