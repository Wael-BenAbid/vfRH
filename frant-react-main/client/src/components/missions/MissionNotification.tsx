// MissionNotification.tsx
import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface MissionNotificationProps {
  type: 'created' | 'completed' | 'error';
  title: string;
  assignedTo?: string;
  supervisor?: string;
  deadline?: string;
}

const MissionNotification: React.FC<MissionNotificationProps> = ({
  type,
  title,
  assignedTo,
  supervisor,
  deadline,
}) => {
  const icons = {
    created: <Clock className="h-5 w-5 text-blue-500" />,
    completed: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
  };

  const themes = {
    created: 'border-l-4 border-blue-500 bg-blue-50',
    completed: 'border-l-4 border-green-500 bg-green-50',
    error: 'border-l-4 border-red-500 bg-red-50',
  };

  return (
    <div className={`p-4 rounded-r-lg ${themes[type]}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">
            {type === 'created' && 'New Mission Created'}
            {type === 'completed' && 'Mission Completed'}
            {type === 'error' && 'Error'}
          </p>
          <p className="mt-1 text-sm text-gray-600">{title}</p>
          {type === 'created' && (
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              {assignedTo && <p>Assigned to: {assignedTo}</p>}
              {supervisor && <p>Supervised by: {supervisor}</p>}
              {deadline && <p>Deadline: {deadline}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionNotification;