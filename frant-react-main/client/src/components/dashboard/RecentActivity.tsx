import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { format } from 'date-fns';
import { 
  Check, 
  X, 
  Clock, 
  Calendar, 
  Briefcase,
  FilePlus 
} from 'lucide-react';

interface ActivityItem {
  id: number;
  title: string;
  date: string;
  type: 'leave' | 'mission' | 'workHours' | 'application';
  status?: 'pending' | 'approved' | 'rejected' | 'completed';
  icon: React.ReactNode;
}

const RecentActivity: React.FC = () => {
  const { leaves } = useSelector((state: RootState) => state.leave);
  const { missions } = useSelector((state: RootState) => state.mission);
  const { workHours } = useSelector((state: RootState) => state.workHours);
  const { jobApplications } = useSelector((state: RootState) => state.jobApplication);

  // Transform data into activity items
  const leaveActivities: ActivityItem[] = leaves.slice(0, 3).map(leave => ({
    id: leave.id,
    title: `Leave request ${leave.status}`,
    date: format(new Date(leave.created_at), 'MMM dd, yyyy'),
    type: 'leave',
    status: leave.status as 'pending' | 'approved' | 'rejected',
    icon: <Calendar className="h-5 w-5 text-blue-500" />,
  }));

  const missionActivities: ActivityItem[] = missions.slice(0, 3).map(mission => ({
    id: mission.id,
    title: mission.title,
    date: format(new Date(mission.created_at), 'MMM dd, yyyy'),
    type: 'mission',
    status: mission.completed ? 'completed' : 'pending',
    icon: <Briefcase className="h-5 w-5 text-indigo-500" />,
  }));

  const workHourActivities: ActivityItem[] = workHours.slice(0, 3).map(workHour => ({
    id: workHour.id,
    title: `Logged ${workHour.hours_worked} hours`,
    date: format(new Date(workHour.date), 'MMM dd, yyyy'),
    type: 'workHours',
    icon: <Clock className="h-5 w-5 text-green-500" />,
  }));

  const applicationActivities: ActivityItem[] = jobApplications.slice(0, 3).map(application => ({
    id: application.id,
    title: `Application for ${application.position}`,
    date: format(new Date(application.created_at), 'MMM dd, yyyy'),
    type: 'application',
    status: application.status as 'pending' | 'approved' | 'rejected',
    icon: <FilePlus className="h-5 w-5 text-purple-500" />,
  }));

  // Combine and sort by date (newest first)
  const allActivities = [...leaveActivities, ...missionActivities, ...workHourActivities, ...applicationActivities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allActivities.length > 0 ? (
            allActivities.map((activity) => (
              <div key={`${activity.type}-${activity.id}`} className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    {activity.status && (
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        activity.status === 'approved' || activity.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : activity.status === 'rejected' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {activity.status === 'approved' || activity.status === 'completed' ? (
                          <Check className="mr-1 h-3 w-3" />
                        ) : activity.status === 'rejected' ? (
                          <X className="mr-1 h-3 w-3" />
                        ) : (
                          <Clock className="mr-1 h-3 w-3" />
                        )}
                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-3">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
