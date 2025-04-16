/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trade-it-blob.public.blob.vercel-storage.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'djyrtfx2a7bufblj.public.blob.vercel-storage.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: ''
      }
    ]
  },
  rewrites: async () => {
    return [
      {
        source: "/api/py/:path*",
        destination: process.env.NODE_ENV === "development"
          ? "http://127.0.0.1:8000/api/py/:path*"
          : "/api/py/index.py"
      }
    ]
  }
};

export default nextConfig;
