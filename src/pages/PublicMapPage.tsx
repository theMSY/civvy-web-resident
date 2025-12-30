import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MainLayout } from '../components/layout/MainLayout';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getMapTileUrl, getMapTileAttribution } from '../config';
import { usePublicIssues } from '../hooks/useApi';
import type { PublicIssue } from '../types/api';

// Fix Leaflet icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Create colored markers for different statuses
const createColoredIcon = (status: PublicIssue['status']) => {
  const colors = {
    pending: '#f59e0b',
    in_progress: '#3b82f6',
    completed: '#10b981',
    rejected: '#ef4444',
  };

  const color = colors[status] || colors.pending;

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 24],
  });
};

interface BoundsUpdateHandlerProps {
  onBoundsChange: (bounds: { minLat: number; minLng: number; maxLat: number; maxLng: number }) => void;
}

const BoundsUpdateHandler: React.FC<BoundsUpdateHandlerProps> = ({ onBoundsChange }) => {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      onBoundsChange({
        minLat: bounds.getSouth(),
        minLng: bounds.getWest(),
        maxLat: bounds.getNorth(),
        maxLng: bounds.getEast(),
      });
    },
  });

  // Initial bounds
  React.useEffect(() => {
    const bounds = map.getBounds();
    onBoundsChange({
      minLat: bounds.getSouth(),
      minLng: bounds.getWest(),
      maxLat: bounds.getNorth(),
      maxLng: bounds.getEast(),
    });
  }, [map, onBoundsChange]);

  return null;
};

export const PublicMapPage: React.FC = () => {
  const [bbox, setBbox] = useState<{
    minLat: number;
    minLng: number;
    maxLat: number;
    maxLng: number;
  } | null>(null);

  const { data: issues, isLoading } = usePublicIssues(bbox);

  const handleBoundsChange = useCallback(
    (newBounds: { minLat: number; minLng: number; maxLat: number; maxLng: number }) => {
      setBbox(newBounds);
    },
    []
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Public Issue Map</h1>
          <p className="text-gray-600">
            View all reported issues in your community. Zoom and pan to explore different areas.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <span>In Progress</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <span>Rejected</span>
            </div>
            {isLoading && (
              <div className="ml-auto">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>

          {/* Map */}
          <div className="h-[600px] rounded-lg overflow-hidden">
            <MapContainer
              center={[46.8182, 8.2275]} // Default to Switzerland
              zoom={13}
              className="h-full w-full"
            >
              <TileLayer
                attribution={getMapTileAttribution()}
                url={getMapTileUrl()}
              />
              <BoundsUpdateHandler onBoundsChange={handleBoundsChange} />
              
              {issues?.map((issue) => (
                <Marker
                  key={issue.id}
                  position={[issue.latitude, issue.longitude]}
                  icon={createColoredIcon(issue.status)}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {issue.category_name || 'Issue'}
                      </h3>
                      <div className="text-sm space-y-1">
                        <p className="text-gray-600">
                          Status: <span className="font-medium">{issue.status}</span>
                        </p>
                        <p className="text-gray-500 text-xs">
                          Reported: {formatDate(issue.created_at)}
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Issue Count */}
          {issues && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {issues.length} issue{issues.length !== 1 ? 's' : ''} in the current view
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
