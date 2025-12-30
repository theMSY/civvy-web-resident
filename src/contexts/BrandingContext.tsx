import React, { createContext, useContext, useEffect } from 'react';
import { useTenantInfo } from '../hooks/useApi';
import type { TenantInfo } from '../types/api';

interface BrandingContextType {
  tenantInfo: TenantInfo | null;
  isLoading: boolean;
  error: Error | null;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within BrandingProvider');
  }
  return context;
};

interface BrandingProviderProps {
  children: React.ReactNode;
}

// Helper to convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Helper to generate color shades
const generateColorShades = (hex: string) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return {};

  // Simple shade generation (could be improved with better color theory)
  const shades: Record<string, string> = {
    50: `rgb(${Math.min(255, rgb.r + 200)}, ${Math.min(255, rgb.g + 200)}, ${Math.min(255, rgb.b + 200)})`,
    100: `rgb(${Math.min(255, rgb.r + 150)}, ${Math.min(255, rgb.g + 150)}, ${Math.min(255, rgb.b + 150)})`,
    200: `rgb(${Math.min(255, rgb.r + 100)}, ${Math.min(255, rgb.g + 100)}, ${Math.min(255, rgb.b + 100)})`,
    300: `rgb(${Math.min(255, rgb.r + 50)}, ${Math.min(255, rgb.g + 50)}, ${Math.min(255, rgb.b + 50)})`,
    400: `rgb(${Math.min(255, rgb.r + 25)}, ${Math.min(255, rgb.g + 25)}, ${Math.min(255, rgb.b + 25)})`,
    500: hex,
    600: `rgb(${Math.max(0, rgb.r - 25)}, ${Math.max(0, rgb.g - 25)}, ${Math.max(0, rgb.b - 25)})`,
    700: `rgb(${Math.max(0, rgb.r - 50)}, ${Math.max(0, rgb.g - 50)}, ${Math.max(0, rgb.b - 50)})`,
    800: `rgb(${Math.max(0, rgb.r - 75)}, ${Math.max(0, rgb.g - 75)}, ${Math.max(0, rgb.b - 75)})`,
    900: `rgb(${Math.max(0, rgb.r - 100)}, ${Math.max(0, rgb.g - 100)}, ${Math.max(0, rgb.b - 100)})`,
  };

  return shades;
};

export const BrandingProvider: React.FC<BrandingProviderProps> = ({ children }) => {
  const { data: tenantInfo, isLoading, error } = useTenantInfo();

  useEffect(() => {
    if (tenantInfo?.primary_color) {
      const primaryColor = tenantInfo.primary_color;
      const shades = generateColorShades(primaryColor);

      // Set CSS variables
      document.documentElement.style.setProperty('--color-primary', primaryColor);
      Object.entries(shades).forEach(([shade, color]) => {
        document.documentElement.style.setProperty(`--color-primary-${shade}`, color);
      });
    }

    // Update page title with commune name
    if (tenantInfo?.commune_name || tenantInfo?.name) {
      document.title = `${tenantInfo.commune_name || tenantInfo.name} - Civvy Resident`;
    }
  }, [tenantInfo]);

  return (
    <BrandingContext.Provider
      value={{
        tenantInfo: tenantInfo || null,
        isLoading,
        error: error as Error | null,
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
};
