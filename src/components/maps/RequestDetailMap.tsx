import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getMapTileUrl, getMapTileAttribution } from '../../config';
import type { Request } from '../../types/api';

interface RequestDetailMapProps {
  request: Request;
  className?: string;
}

export const RequestDetailMap: React.FC<RequestDetailMapProps> = ({
  request,
  className = '',
}) => {
  const position: [number, number] = [request.latitude, request.longitude];

  return (
    <div className={className}>
      <MapContainer
        center={position}
        zoom={15}
        className="h-full w-full rounded-lg"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution={getMapTileAttribution()}
          url={getMapTileUrl()}
        />
        <Marker position={position}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{request.category_name || 'Issue'}</h3>
              <p className="text-sm text-gray-600">{request.status}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
