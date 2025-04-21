import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { User } from '../../types';
import {
  Home,
  Users,
  Calendar,
  Briefcase,
  Clock,
  GraduationCap,
  FileText,
  LogOut,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { logout } from '../../store/authSlice';

interface SidebarProps {
  open: boolean;
  user: User | null;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  allowedUserTypes: Array<'admin' | 'employee' | 'intern'>;
}

const Sidebar: React.FC<SidebarProps> = ({ open, user }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const navigationItems: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="text-gray-400 group-hover:text-primary w-5 h-5" />,
      allowedUserTypes: ['admin', 'employee', 'intern'],
    },
    {
      name: 'Employees',
      href: '/employees',
      icon: <Users className="text-gray-400 group-hover:text-primary w-5 h-5" />,
      allowedUserTypes: ['admin'],
    },
    {
      name: 'Leave Management',
      href: '/leave',
      icon: <Calendar className="text-gray-400 group-hover:text-primary w-5 h-5" />,
      allowedUserTypes: ['admin', 'employee', 'intern'],
    },
    {
      name: 'Missions',
      href: '/missions',
      icon: <Briefcase className="text-gray-400 group-hover:text-primary w-5 h-5" />,
      allowedUserTypes: ['admin', 'employee', 'intern'],
    },
    {
      name: 'Work Hours',
      href: '/work-hours',
      icon: <Clock className="text-gray-400 group-hover:text-primary w-5 h-5" />,
      allowedUserTypes: ['admin', 'employee', 'intern'],
    },
    {
      name: 'Internships',
      href: '/internships',
      icon: <GraduationCap className="text-gray-400 group-hover:text-primary w-5 h-5" />,
      allowedUserTypes: ['admin', 'employee', 'intern'],
    },
    {
      name: 'Job Applications',
      href: '/job-applications',
      icon: <FileText className="text-gray-400 group-hover:text-primary w-5 h-5" />,
      allowedUserTypes: ['admin'],
    },
  ];

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      dispatch(logout() as any);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    }
  };

  const filteredNavItems = user
    ? navigationItems.filter((item) => item.allowedUserTypes.includes(user.user_type as any))
    : [];

  return (
    <aside
      className={`sidebar bg-white h-full border-r border-gray-200 fixed z-10 transition-all duration-300 ${
        open ? 'open' : ''
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">SystemeRH</h1>
        </div>

        {/* User Info */}
        {user && (
          <div className="flex items-center p-4 border-b border-gray-200">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
              <span className="text-primary-700 font-medium">
                {(user.first_name?.charAt(0) || '') + (user.last_name?.charAt(0) || '')}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">
                {(user.first_name || '') + ' ' + (user.last_name || '')}
              </p>
              <p className="text-xs text-gray-500">
                {user.user_type
                  ? user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)
                  : ''}
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {filteredNavItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-md ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-800 hover:bg-primary-50 hover:text-primary-600'
                    } group transition-colors`
                  }
                >
                  {item.icon}
                  <span className="ml-3 text-sm">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 text-sm text-gray-800 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors group"
          >
            <LogOut className="text-gray-400 group-hover:text-red-600 w-5 h-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
