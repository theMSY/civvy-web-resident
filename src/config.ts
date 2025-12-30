// Runtime configuration from window.__CONFIG__
export interface AppConfig {
  API_BASE_URL: string;
  MAP_TILE_URL: string;
  MAP_TILE_ATTRIBUTION: string;
}

declare global {
  interface Window {
    __CONFIG__: AppConfig;
  }
}

export const getConfig = (): AppConfig => {
  return window.__CONFIG__;
};

export const getApiBaseUrl = (): string => {
  const config = getConfig();
  return config.API_BASE_URL || '';
};

export const getMapTileUrl = (): string => {
  const config = getConfig();
  return config.MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
};

export const getMapTileAttribution = (): string => {
  const config = getConfig();
  return config.MAP_TILE_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
};
