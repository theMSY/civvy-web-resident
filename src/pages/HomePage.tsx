import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { useSession } from '../hooks/useApi';
import { useBranding } from '../contexts/BrandingContext';
import { Button } from '../components/common/Button';

export const HomePage: React.FC = () => {
  const { data: session } = useSession();
  const { tenantInfo } = useBranding();

  const handleLogin = () => {
    window.location.href = '/api/v1/auth/login';
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to {tenantInfo?.commune_name || tenantInfo?.name || 'Civvy'}
          </h1>
          <p className="text-xl text-gray-600">
            Report issues and track their progress in your community
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Report Issue Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold mb-3">Report an Issue</h2>
            <p className="text-gray-600 mb-4">
              Found a problem in your community? Report it with photos and location details.
            </p>
            {session?.authenticated ? (
              <Link to="/report-issue">
                <Button variant="primary">Report Issue</Button>
              </Link>
            ) : (
              <Button variant="primary" onClick={handleLogin}>
                Login to Report
              </Button>
            )}
          </div>

          {/* Public Map Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🗺️</div>
            <h2 className="text-2xl font-semibold mb-3">Public Map</h2>
            <p className="text-gray-600 mb-4">
              View all reported issues in your area on an interactive map.
            </p>
            <Link to="/public-map">
              <Button variant="outline">View Map</Button>
            </Link>
          </div>

          {/* My Requests Card */}
          {session?.authenticated && (
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📋</div>
              <h2 className="text-2xl font-semibold mb-3">My Requests</h2>
              <p className="text-gray-600 mb-4">
                Track the status of your submitted requests and see updates.
              </p>
              <Link to="/my-requests">
                <Button variant="outline">View My Requests</Button>
              </Link>
            </div>
          )}

          {/* About Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">ℹ️</div>
            <h2 className="text-2xl font-semibold mb-3">About</h2>
            <p className="text-gray-600 mb-4">
              Learn more about how you can help improve your community.
            </p>
            <Link to="/public-map">
              <Button variant="ghost">Learn More</Button>
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        {!session?.authenticated && (
          <div className="bg-primary/10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
            <p className="text-gray-700 mb-6">
              Login to report issues and track your requests
            </p>
            <Button variant="primary" size="lg" onClick={handleLogin}>
              Login Now
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
