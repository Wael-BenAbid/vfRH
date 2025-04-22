import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import WorkHoursTable from '../components/workHours/WorkHoursTable';
import WorkHoursForm from '../components/workHours/WorkHoursForm';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchWorkHours, createWorkHours } from '../store/workHoursSlice';
import { fetchEmployees } from '../store/employeeSlice';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

const WorkHoursPage: React.FC = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { workHours, loading, error } = useSelector((state: RootState) => state.workHours);
  const { employees } = useSelector((state: RootState) => state.employee);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [logHoursModalOpen, setLogHoursModalOpen] = useState(false);
  
  useEffect(() => {
    dispatch(fetchWorkHours() as any);
    if (user?.user_type === 'admin') {
      dispatch(fetchEmployees() as any);
    }
  }, [dispatch, user]);
  
  const handleLogHours = () => {
    setLogHoursModalOpen(true);
  };
  
  const handleSubmitHours = async (data: any) => {
    try {
      await dispatch(createWorkHours(data) as any);
      setLogHoursModalOpen(false);
      toast({
        title: 'Success',
        description: 'Work hours logged successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log work hours',
        variant: 'destructive',
      });
    }
  };
  
  // Prepare weekly chart data
  const getWeeklyChartData = () => {
    const now = new Date();
    const firstDay = startOfWeek(now, { weekStartsOn: 1 }); // Start from Monday
    const lastDay = endOfWeek(now, { weekStartsOn: 1 });
    
    const days = eachDayOfInterval({ start: firstDay, end: lastDay });
    
    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayHours = workHours.filter(wh => {
        const whDate = new Date(wh.date);
        return isSameDay(whDate, day);
      });
      
      const totalHours = dayHours.reduce((sum, wh) => sum + Number(wh.hours_worked), 0);
      
      return {
        day: format(day, 'EEE'),
        hours: totalHours,
      };
    });
  };

  return (
    <MainLayout title="Work Hours">
      {/* Work Hours Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Weekly Work Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getWeeklyChartData()}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hours" name="Hours Worked" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Work Hours Table */}
      <WorkHoursTable 
        workHours={workHours}
        onLogHours={handleLogHours}
      />
      
      {/* Log Hours Modal */}
      <WorkHoursForm
        open={logHoursModalOpen}
        onClose={() => setLogHoursModalOpen(false)}
        onSubmit={handleSubmitHours}
        employees={user?.user_type === 'admin' ? employees : undefined}
      />
    </MainLayout>
  );
};

export default WorkHoursPage;
