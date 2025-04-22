import React, { useEffect } from 'react';
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const jobApplications = useSelector((state: RootState) => state.jobApplication.jobApplications);
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchLeaves() as any);
    dispatch(fetchMissions() as any);
    dispatch(fetchWorkHours() as any);
    
    if (user?.user_type === 'admin') {
      dispatch(fetchJobApplications() as any);
    }
  }, [dispatch, user]);
  
  // Generate mock data for the work hours chart
  const generateWorkHoursData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      data.push({
        day: format(date, 'EEE'),
        hours: Math.floor(Math.random() * 5) + 5 // Random hours between 5-10
      });
    }
    return data;
  };
  
  const workHoursData = generateWorkHoursData();

  // Handle approve and reject actions
  const handleApprove = (id: number) => {
    dispatch(approveJobApplication(id) as any);
  };

  const handleReject = (id: number) => {
    dispatch(rejectJobApplication(id) as any);
  };

  return (
    <MainLayout title="Dashboard">
      {/* Stats Cards */}
      <DashboardStats />
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Work Hours Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Work Hours This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={workHoursData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
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
      
      {/* Messages, Announcements, or other content can go here */}
      {user?.user_type === 'admin' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Admin Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-primary-50 rounded-lg text-center">
                  <h3 className="font-medium text-primary-900">Pending Leaves</h3>
                  <p className="text-2xl font-bold text-primary-700">
                    {useSelector((state: RootState) => 
                      state.leave.leaves.filter(leave => leave.status === 'pending').length
                    )}
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg text-center">
                  <h3 className="font-medium text-amber-900">Active Missions</h3>
                  <p className="text-2xl font-bold text-amber-700">
                    {useSelector((state: RootState) => 
                      state.mission.missions.filter(mission => !mission.completed).length
                    )}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <h3 className="font-medium text-green-900">New Applications</h3>
                  <p className="text-2xl font-bold text-green-700">
                    {useSelector((state: RootState) => 
                      state.jobApplication.jobApplications.filter(app => app.status === 'pending').length
                    )}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <h3 className="font-medium text-blue-900">Total Employees</h3>
                  <p className="text-2xl font-bold text-blue-700">
                    {useSelector((state: RootState) => state.employee.employees.length)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending Job Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {jobApplications.length === 0 ? (
                <p className="text-gray-600">No job applications found.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {jobApplications
                    .filter((app) => app.status === 'pending')
                    .map((application) => (
                      <div
                        key={application.id}
                        className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {application.first_name} {application.last_name}
                          </h3>
                          <p className="text-sm text-gray-600">{application.email}</p>
                          <p className="text-sm text-gray-500">Position: {application.position}</p>
                          <p className="text-sm text-gray-500">
                            Submitted on: {new Date(application.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="secondary"
                            onClick={() => handleApprove(application.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleReject(application.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </MainLayout>
  );
};

export default DashboardPage;
