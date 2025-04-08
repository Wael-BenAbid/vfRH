import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Clock, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { format, addDays } from 'date-fns';

interface LeaveStatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  color: string;
  footer?: React.ReactNode;
}

const LeaveStatCard: React.FC<LeaveStatCardProps> = ({ title, value, icon, color, footer }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`rounded-full ${color} p-3`}>
            {icon}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
          </div>
        </div>
        {footer && (
          <div className="mt-4">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const LeaveStats: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { leaves } = useSelector((state: RootState) => state.leave);
  
  const pendingLeaves = leaves.filter(leave => leave.status === 'pending');
  
  // Find the next upcoming approved leave
  const upcomingLeave = leaves
    .filter(leave => leave.status === 'approved' && new Date(leave.start_date) > new Date())
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0];
  
  // Format for upcoming leave display
  const formatUpcomingLeave = () => {
    if (!upcomingLeave) return 'None scheduled';
    
    const startDate = new Date(upcomingLeave.start_date);
    const endDate = new Date(upcomingLeave.end_date);
    
    // If it's a single day
    if (startDate.getTime() === endDate.getTime()) {
      return format(startDate, 'MMM dd, yyyy');
    }
    
    // If it spans multiple days
    return `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd')}`;
  };

  // Days until next leave
  const getDaysUntilNextLeave = () => {
    if (!upcomingLeave) return 'N/A';
    
    const today = new Date();
    const startDate = new Date(upcomingLeave.start_date);
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} days from now`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Available Balance */}
      <LeaveStatCard
        title="Leave Balance"
        value={`${user?.leave_balance} days`}
        icon={<CalendarDays className="text-primary-600 h-6 w-6" />}
        color="bg-primary-100"
        footer={
          <>
            <Progress 
              value={(user?.leave_balance ?? 0) / 30 * 100} 
              className="h-2 mt-2" 
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>0 days</span>
              <span>30 days</span>
            </div>
          </>
        }
      />
      
      {/* Pending Requests */}
      <LeaveStatCard
        title="Pending Requests"
        value={pendingLeaves.length}
        icon={<Clock className="text-amber-600 h-6 w-6" />}
        color="bg-amber-100"
        footer={
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="text-xs text-gray-600 ml-2">Awaiting approval</span>
            </div>
            {pendingLeaves.length > 0 && (
              <span className="text-xs text-primary-600 hover:underline cursor-pointer">
                View all
              </span>
            )}
          </div>
        }
      />
      
      {/* Upcoming Leave */}
      <LeaveStatCard
        title="Upcoming Leave"
        value={formatUpcomingLeave()}
        icon={<Calendar className="text-green-600 h-6 w-6" />}
        color="bg-green-100"
        footer={
          upcomingLeave && (
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-xs text-gray-600 ml-2">Approved</span>
              </div>
              <span className="text-xs text-gray-500">{getDaysUntilNextLeave()}</span>
            </div>
          )
        }
      />
    </div>
  );
};

export default LeaveStats;
