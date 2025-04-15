import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { checkAuthStatus } from './store/authSlice';
import { queryClient } from './lib/queryClient';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PublicJobApplicationPage from './pages/PublicJobApplicationPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import LeavePage from './pages/LeavePage';
import MissionsPage from './pages/MissionsPage';
import WorkHoursPage from './pages/WorkHoursPage';
import InternshipsPage from './pages/InternshipsPage';
import JobApplicationsPage from './pages/JobApplicationsPage';
import NotFound from './pages/not-found';

// Layout
import MainLayout from './components/layouts/MainLayout';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" />
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce delay-100" />
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce delay-200" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/postuler" element={<PublicJobApplicationPage />} />

        {/* Protected Routes */}
        <Route
          element={
            <PrivateRoute>
              <MainLayout title="Dashboard" />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/leave" element={<LeavePage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/work-hours" element={<WorkHoursPage />} />
          <Route path="/internships" element={<InternshipsPage />} />
          <Route path="/job-applications" element={<JobApplicationsPage />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;