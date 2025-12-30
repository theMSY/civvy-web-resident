# Civvy Resident Web App

A modern React-based single-page application (SPA) for residents to report and track community issues. Built with TypeScript, React Router, TanStack Query (React Query), Zod, React Hook Form, and Tailwind CSS.

## Features

- **Multi-tenant Support**: Dynamic branding based on tenant configuration
- **Authentication**: Backend-for-Frontend (BFF) pattern with session-based auth
- **Issue Reporting**: Report community issues with location, description, and photos
- **Interactive Maps**: Leaflet-based maps with OpenStreetMap tiles
- **Request Tracking**: View and track your submitted requests
- **Public Map**: Browse all reported issues in your community
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS
- **Maps**: Leaflet + React Leaflet
- **Deployment**: Docker + nginx

## Prerequisites

- Node.js 20+
- npm or yarn
- Docker (for containerized deployment)

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

The application uses runtime configuration via `window.__CONFIG__`. For local development, the default config in `index.html` will be used.

To override, create a `.env` file (optional):

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### 4. Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## API Integration

The application expects the following backend endpoints:

### Public Endpoints

- `GET /api/v1/public/tenant-info` - Get tenant branding information
- `GET /api/v1/public/categories` - Get issue categories (fallback if not available)
- `GET /api/v1/public/issues?bbox=minLng,minLat,maxLng,maxLat` - Get public issues for map

### Authentication Endpoints

- `GET /api/v1/auth/login` - Redirect to login (BFF pattern)
- `GET /api/v1/auth/session` - Check current session
- `POST /api/v1/auth/logout` - Logout

### Protected Endpoints

- `POST /api/v1/requests` - Create a new request
- `GET /api/v1/requests/mine` - Get user's requests
- `GET /api/v1/requests/:id` - Get request details
- `GET /api/v1/requests/:id/timeline` - Get request timeline
- `POST /api/v1/requests/:id/attachments` - Upload attachment

## Docker Deployment

### Build Docker Image

```bash
docker build -t civvy-web-resident .
```

### Run Container

```bash
docker run -d \
  -p 8080:80 \
  -e API_BASE_URL="" \
  -e MAP_TILE_URL="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" \
  civvy-web-resident
```

### Environment Variables

- `API_BASE_URL`: Base URL for API calls (empty string for same-origin)
- `MAP_TILE_URL`: OpenStreetMap tile server URL
- `MAP_TILE_ATTRIBUTION`: Attribution text for map tiles

## Architecture

### Multi-Tenant Bootstrapping

On application load, the app calls `GET /api/v1/public/tenant-info` to fetch:
- Tenant logo
- Primary brand color
- Commune name

The branding is applied dynamically using CSS variables and React context.

### Authentication Flow

1. User clicks "Login" → Redirects to `/api/v1/auth/login`
2. Backend handles OAuth/OIDC flow
3. User redirected back with session cookie
4. App checks session via `GET /api/v1/auth/session`
5. Protected routes require valid session

### State Management

- **TanStack Query**: API data fetching and caching
- **React Context**: Branding/tenant information
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation and form validation

### Map Integration

- Uses Leaflet with OpenStreetMap tiles (no API keys required)
- Tile server URL configurable via environment variable
- Supports browser geolocation for "use my location" feature

## Project Structure

```
src/
├── api/              # API client and service functions
├── components/       # React components
│   ├── auth/        # Authentication components
│   ├── common/      # Shared UI components
│   ├── layout/      # Layout components
│   ├── maps/        # Map components
│   └── requests/    # Request-related components
├── contexts/        # React contexts (branding, etc.)
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── types/           # TypeScript types and Zod schemas
├── utils/           # Utility functions
├── config.ts        # Runtime configuration
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

## Development Guidelines

### Adding New API Endpoints

1. Define Zod schema in `src/types/api.ts`
2. Add service function in `src/api/services.ts`
3. Create React Query hook in `src/hooks/useApi.ts`
4. Use hook in components

### Styling

- Use Tailwind utility classes
- Primary brand color available via `bg-primary`, `text-primary`, etc.
- Custom colors defined in `tailwind.config.js`

### Forms

- Use React Hook Form with Zod resolver
- Example: See `src/pages/ReportIssuePage.tsx`

## Deployment with Traefik

The application is designed to be deployed behind Traefik reverse proxy:

```yaml
# docker-compose.yml example
services:
  web:
    image: civvy-web-resident
    environment:
      - API_BASE_URL=
      - MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.resident.rule=Host(`tenant.civvy.example.com`)"
      - "traefik.http.routers.resident.entrypoints=websecure"
      - "traefik.http.services.resident.loadbalancer.server.port=80"
```

## Contributing

1. Follow existing code style
2. Use TypeScript for type safety
3. Validate forms with Zod schemas
4. Test all API integrations
5. Ensure responsive design

## License

Copyright © 2025 Civvy. All rights reserved.
