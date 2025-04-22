import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
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
    return <Navigate to="/login" />;
  }

  return children;
};

function AppRouter() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus() as any);
  }, [dispatch]);

  return (
    <Routes>
      {/* Pages publiques */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/postuler" element={<PublicJobApplicationPage />} />

      {/* Pages privées */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <PrivateRoute>
            <EmployeesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/leave"
        element={
          <PrivateRoute>
            <LeavePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/missions"
        element={
          <PrivateRoute>
            <MissionsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/work-hours"
        element={
          <PrivateRoute>
            <WorkHoursPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/internships"
        element={
          <PrivateRoute>
            <InternshipsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/job-applications"
        element={
          <PrivateRoute>
            <JobApplicationsPage 
              open={true} 
              onClose={() => console.log("Closed")} 
              onSubmit={(data) => console.log("Submitted", data)} 
            />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRouter />
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
