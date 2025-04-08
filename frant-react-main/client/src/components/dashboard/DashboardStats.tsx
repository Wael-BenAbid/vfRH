import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, BriefcaseIcon, Clock, CalendarDays } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, icon, color }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`rounded-full ${color} p-3`}>
            {icon}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardStats: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { leaves } = useSelector((state: RootState) => state.leave);
  const { missions } = useSelector((state: RootState) => state.mission);
  
  const pendingLeaves = leaves.filter(leave => leave.status === 'pending');
  const activeMissions = missions.filter(mission => !mission.completed);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatsCard
        title="Leave Balance"
        value={user?.leave_balance ?? 0}
        description="Your available leave days"
        icon={<CalendarDays className="text-primary-600 h-6 w-6" />}
        color="bg-primary-100"
      />
      
      <StatsCard
        title="Pending Leaves"
        value={pendingLeaves.length}
        description="Awaiting approval"
        icon={<CalendarDays className="text-amber-600 h-6 w-6" />}
        color="bg-amber-100"
      />
      
      <StatsCard
        title="Active Missions"
        value={activeMissions.length}
        description="Tasks to complete"
        icon={<BriefcaseIcon className="text-indigo-600 h-6 w-6" />}
        color="bg-indigo-100"
      />
      
      <StatsCard
        title="Team Members"
        value={user?.user_type === 'admin' ? '25' : '5'}
        description="In your department"
        icon={<User className="text-teal-600 h-6 w-6" />}
        color="bg-teal-100"
      />
    </div>
  );
};

export default DashboardStats;
