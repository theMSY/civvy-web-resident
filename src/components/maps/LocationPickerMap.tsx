import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { getMapTileUrl, getMapTileAttribution } from '../../config';
import { Button } from '../common/Button';

// Fix Leaflet default marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface LocationPickerMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
  className?: string;
}

const MapClickHandler: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  onLocationSelect,
  selectedLocation,
  className = '',
}) => {
  const [center, setCenter] = useState<[number, number]>([46.8182, 8.2275]); // Default to Switzerland
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleUseMyLocation = () => {
    setIsLoadingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]);
          onLocationSelect(latitude, longitude);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please click on the map to set a location.');
          setIsLoadingLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setIsLoadingLocation(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-4 right-4 z-[1000]">
        <Button
          variant="primary"
          size="sm"
          onClick={handleUseMyLocation}
          isLoading={isLoadingLocation}
          className="shadow-lg"
        >
          📍 Use My Location
        </Button>
      </div>
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full rounded-lg"
      >
        <TileLayer
          attribution={getMapTileAttribution()}
          url={getMapTileUrl()}
        />
        <MapClickHandler onLocationSelect={onLocationSelect} />
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
        )}
      </MapContainer>
    </div>
  );
};
