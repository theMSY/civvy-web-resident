import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { RequestDetailMap } from '../components/maps/RequestDetailMap';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useRequest, useRequestTimeline } from '../hooks/useApi';
import type { Request } from '../types/api';

const StatusBadge: React.FC<{ status: Request['status'] }> = ({ status }) => {
  const statusConfig = {
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
    in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-800' },
    completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export const RequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: request, isLoading: requestLoading, error: requestError } = useRequest(id!);
  const { data: timeline, isLoading: timelineLoading } = useRequestTimeline(id!);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (requestLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (requestError || !request) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <ErrorMessage
            title="Failed to load request"
            message={(requestError as Error)?.message || 'Request not found'}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/my-requests"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
        >
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to My Requests
        </Link>

        {/* Request Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {request.category_name || 'Issue Report'}
              </h1>
              <p className="text-sm text-gray-500">
                Submitted on {formatDate(request.created_at)}
              </p>
            </div>
            <StatusBadge status={request.status} />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
          </div>

          {request.attachments && request.attachments.length > 0 && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {request.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={attachment.thumbnail_url || attachment.url}
                      alt="Issue attachment"
                      className="rounded-lg shadow-md hover:shadow-lg transition-shadow w-full h-32 object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Location Map */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
          <div className="h-96">
            <RequestDetailMap request={request} className="h-full" />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Coordinates: {request.latitude.toFixed(6)}, {request.longitude.toFixed(6)}
          </p>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
          {timelineLoading ? (
            <LoadingSpinner size="sm" />
          ) : timeline && timeline.length > 0 ? (
            <div className="space-y-4">
              {timeline.map((event, index) => (
                <div key={event.id} className="flex">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="ml-4 w-0.5 h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="ml-4 pb-4">
                    <p className="text-sm font-medium text-gray-900">{event.event_type}</p>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    {event.user_name && (
                      <p className="text-xs text-gray-500 mt-1">by {event.user_name}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(event.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No timeline events yet</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
