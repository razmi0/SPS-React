# Changelog

## sps-front-1.1.0

- **feat**: Enhance Vite configuration with dynamic versioning and API proxy setup
  - Add version-based file naming for bundled assets (`sps-[name]-v[version]-[hash].js`)
  - Configure Vite dev server proxy for `/api` endpoints using `VITE_API_URL`
- **refactor**: Simplify client-fetch utility to use relative paths for API requests
  - Remove environment-based URL logic from client code
  - Use relative paths in both dev (proxied) and production (direct) environments
  - Fix refresh endpoint bug where it was using localhost in production
- **refactor**: Remove console log for environment variables in App component

## sps-front-1.0.2

- Initial release of Swiss Padel Stars frontend application
- React dom & router / TypeScript / Tailwind / Vite
