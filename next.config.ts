/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  rewrites: async () => {
    return [
      {
        source: "/api/py/:path*",
        destination: process.env.NODE_ENV === "development"
          ? "http://127.0.0.1:8000/api/py/:path*"
          : "/app/api/py/"
      }
    ]
  }
};

export default nextConfig;
