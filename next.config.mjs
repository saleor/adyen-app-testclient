/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.saleor.cloud",
        port: "",
      },
    ],
  },
};

export default nextConfig;
