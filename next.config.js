/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for the app to be deployed as static files
  output: 'export',
  // Optional: Add a trailing slash to all paths
  trailingSlash: true,
  // Optional: Configure image optimization
  images: {
    unoptimized: true, // Disable Image Optimization API as we're exporting static files
  },
  // Add any other Next.js config options here
};

module.exports = nextConfig;
