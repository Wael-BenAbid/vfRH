import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { useLocation } from 'wouter';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const LoginPage: React.FC = () => {
  const [_, setLocation] = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (isAuthenticated) {
    setLocation('/dashboard');
    return null;
  }
  
  return <LoginForm />;
};

export default LoginPage;
