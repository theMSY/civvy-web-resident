import React from 'react';
import { Link } from 'react-router-dom';
import { useBranding } from '../../contexts/BrandingContext';
import { useSession, useLogout } from '../../hooks/useApi';
import { Button } from '../common/Button';

export const Header: React.FC = () => {
  const { tenantInfo } = useBranding();
  const { data: session } = useSession();
  const logoutMutation = useLogout();

  const handleLogin = () => {
    window.location.href = '/api/v1/auth/login';
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Name */}
          <Link to="/" className="flex items-center space-x-3">
            {tenantInfo?.logo_url ? (
              <img
                src={tenantInfo.logo_url}
                alt={tenantInfo.name}
                className="h-10 w-auto"
              />
            ) : (
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                {tenantInfo?.name?.charAt(0) || 'C'}
              </div>
            )}
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {tenantInfo?.commune_name || tenantInfo?.name || 'Civvy'}
              </div>
              <div className="text-xs text-gray-500">Resident Portal</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/public-map"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Public Map
            </Link>
            {session?.authenticated && (
              <>
                <Link
                  to="/my-requests"
                  className="text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  My Requests
                </Link>
                <Link
                  to="/report-issue"
                  className="text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  Report Issue
                </Link>
              </>
            )}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center space-x-3">
            {session?.authenticated ? (
              <>
                <span className="text-sm text-gray-600 hidden md:inline">
                  {session.user?.name || session.user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  isLoading={logoutMutation.isPending}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={handleLogin}>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <nav className="px-4 py-3 space-y-2">
          <Link
            to="/"
            className="block text-gray-700 hover:text-primary font-medium py-2"
          >
            Home
          </Link>
          <Link
            to="/public-map"
            className="block text-gray-700 hover:text-primary font-medium py-2"
          >
            Public Map
          </Link>
          {session?.authenticated && (
            <>
              <Link
                to="/my-requests"
                className="block text-gray-700 hover:text-primary font-medium py-2"
              >
                My Requests
              </Link>
              <Link
                to="/report-issue"
                className="block text-gray-700 hover:text-primary font-medium py-2"
              >
                Report Issue
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
