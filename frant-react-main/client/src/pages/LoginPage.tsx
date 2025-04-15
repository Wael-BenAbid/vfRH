import React, { useEffect } from 'react';
import LoginForm from '../components/auth/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return <LoginForm />;
};

export default LoginPage;