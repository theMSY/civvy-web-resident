import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../../hooks/useApi';
import { LoadingPage } from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { data: session, isLoading } = useSession();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!session?.authenticated) {
    // Redirect to home with a message or show login prompt
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
