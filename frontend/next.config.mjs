/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: process.env.NODE_ENV === 'development' 
            ? 'http://localhost:8080/api/:path*'
            : 'http://backend:8080/api/:path*',
        },
      ];
    },
    poweredByHeader: false,
    output: 'standalone',
  };
  
  export default nextConfig;