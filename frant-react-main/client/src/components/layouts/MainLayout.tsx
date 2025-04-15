import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  Calendar,
  Briefcase,
  Clock,
  GraduationCap,
  FileText,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RootState, AppDispatch  } from '../../store';
import { logout } from '../../store/authSlice';
import { useDispatch } from 'react-redux';

interface MainLayoutProps {
  title: string;
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ title }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutGrid className="w-5 h-5" />,
      showFor: ['admin', 'employee', 'intern'],
    },
    {
      name: 'User Management',
      path: '/employees',
      icon: <Users className="w-5 h-5" />,
      showFor: ['admin'],
    },
    {
      name: 'Leave Requests',
      path: '/leave',
      icon: <Calendar className="w-5 h-5" />,
      showFor: ['admin', 'employee', 'intern'],
    },
    {
      name: 'Missions',
      path: '/missions',
      icon: <Briefcase className="w-5 h-5" />,
      showFor: ['admin', 'employee'],
    },
    {
      name: 'Work Hours',
      path: '/work-hours',
      icon: <Clock className="w-5 h-5" />,
      showFor: ['admin', 'employee', 'intern'],
    },
    {
      name: 'Internships',
      path: '/internships',
      icon: <GraduationCap className="w-5 h-5" />,
      showFor: ['admin', 'intern'],
    },
    {
      name: 'Job Applications',
      path: '/job-applications',
      icon: <FileText className="w-5 h-5" />,
      showFor: ['admin'],
    },
  ];

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => navigate('/login'))
      .catch((error) => console.error('Logout failed:', error));
  };

  const isAllowed = (allowedRoles: string[]) => {
    return user && allowedRoles.includes(user.user_type);
  };

  const filteredNavigation = navigationItems.filter(item => 
    isAllowed(item.showFor)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800">HR System</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {filteredNavigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {user?.first_name?.[0]}
                    {user?.last_name?.[0]}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.user_type}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <header className="h-16 bg-white border-b border-gray-200">
          <div className="h-full px-6 flex items-center">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;