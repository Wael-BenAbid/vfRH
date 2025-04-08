import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Users, Calendar, Briefcase, MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const MobileNavigation: React.FC = () => {
  const [location] = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const mobileNavItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="text-base" />,
      allowedUserTypes: ['admin', 'employee', 'intern'],
    },
    {
      name: 'Employees',
      href: '/employees',
      icon: <Users className="text-base" />,
      allowedUserTypes: ['admin'],
    },
    {
      name: 'Leave',
      href: '/leave',
      icon: <Calendar className="text-base" />,
      allowedUserTypes: ['admin', 'employee', 'intern'],
    },
    {
      name: 'Missions',
      href: '/missions',
      icon: <Briefcase className="text-base" />,
      allowedUserTypes: ['admin', 'employee', 'intern'],
    },
    {
      name: 'More',
      href: '#more',
      icon: <MoreHorizontal className="text-base" />,
      allowedUserTypes: ['admin', 'employee', 'intern'],
    },
  ];

  const filteredNavItems = user 
    ? mobileNavItems.filter(item => item.allowedUserTypes.includes(user.user_type as any))
    : [];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around px-2 py-2 z-10">
      {filteredNavItems.map((item) => (
        <Link href={item.href} key={item.name}>
          <a className={`flex flex-col items-center ${
            location === item.href 
              ? 'text-primary-600' 
              : 'text-gray-500 hover:text-primary-600'
          } px-2`}>
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default MobileNavigation;
