// DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentActivity from '../components/dashboard/RecentActivity';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchLeaves } from '../store/leaveSlice';
import { fetchMissions } from '../store/missionSlice';
import { fetchWorkHours } from '../store/workHoursSlice';
import { fetchJobApplications, approveJobApplication, rejectJobApplication } from '../store/jobApplicationSlice';
import { fetchEmployees } from '../store/employeeSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import JobApplicationForm from '../pages/JobApplicationsPage';
import axios from 'axios';

const fetchJobApplicationsWithToken = async (token: string) => {
  try {
    const response = await axios.get('http://localhost:8000/api/job-applications/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return [];
  }
};

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    jobApplications: reduxJobApplications,
    loading: applicationsLoading,
    error: applicationsError
  } = useSelector((state: RootState) => state.jobApplication);
  const { employees, loading: employeesLoading, error: employeesError } = useSelector((state: RootState) => state.employee);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jobApplications, setJobApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchLeaves() as any);
    dispatch(fetchMissions() as any);
    dispatch(fetchWorkHours() as any);
    dispatch(fetchEmployees() as any);
  }, [dispatch]);

  // Fetch job applications
  useEffect(() => {
    dispatch(fetchJobApplications() as any);
  }, [dispatch]);

  // Fetch job applications for admin
  useEffect(() => {
    if (user?.user_type === 'admin') {
      console.log('Fetching job applications...');
      dispatch(fetchJobApplications() as any);
    }
  }, [dispatch, user]);

  // Fetch job applications using token
  useEffect(() => {
    const token = localStorage.getItem('token'); // Récupérez le token depuis le stockage local
    if (token) {
      fetchJobApplicationsWithToken(token)
        .then((data) => {
          setJobApplications(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to fetch job applications');
          setLoading(false);
        });
    } else {
      setError('No token found');
      setLoading(false);
    }
  }, []);

  // Log job applications in Redux
  useEffect(() => {
    console.log('Job applications in Redux:', reduxJobApplications);
  }, [reduxJobApplications]);

  // Work hours chart data
  const generateWorkHoursData = () => {
    return Array.from({ length: 7 }, (_, i) => ({
      day: format(subDays(new Date(), 6 - i), 'EEE'),
      hours: Math.floor(Math.random() * 5) + 5
    }));
  };

  // Handlers for job applications
  const handleApplicationAction = (id: number, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      dispatch(approveJobApplication(id) as any);
    } else {
      dispatch(rejectJobApplication(id) as any);
    }
  };

  return (
    <MainLayout title="Dashboard">
      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Work Hours Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Work Hours This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={generateWorkHoursData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="hsl(var(--primary))" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>

      {user?.user_type === 'admin' && (
        <>
          {/* Admin Quick Links */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Admin Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* ... (keep your existing stats cards) */}
              </div>
            </CardContent>
          </Card>

          {/* Pending Job Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Job Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {applicationsLoading ? (
                <p>Loading applications...</p>
              ) : applicationsError ? (
                <p className="text-red-500">{applicationsError}</p>
              ) : reduxJobApplications.length === 0 ? (
                <p className="text-gray-600">No job applications found</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {reduxJobApplications.map((application) => (
                    <div key={application.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {application.first_name} {application.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">{application.email}</p>
                        <p className="text-sm text-gray-500">Position: {application.position}</p>
                        <p className="text-sm text-gray-500">
                          Submitted on: {new Date(application.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          {employeesLoading ? (
            <p>Loading team members...</p>
          ) : employeesError ? (
            <p className="text-red-500">{employeesError}</p>
          ) : employees.length === 0 ? (
            <p className="text-gray-600">No team members found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {employees.map((employee) => (
                <div key={employee.id} className="p-4 bg-muted rounded-lg text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-xl">
                      {employee.first_name[0]}
                      {employee.last_name[0]}
                    </span>
                  </div>
                  <h3 className="font-medium">
                    {employee.first_name} {employee.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{employee.position}</p>
                </div>
              ))}
            </div>
          )}
          {/* Bouton pour accéder à la page Employees */}
          <div className="mt-4 text-center">
            <Link to="/employees">
              <Button variant="default">View All Employees</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default DashboardPage;