/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aggregator-devnet.walrus.space",
        port: "",
      },
    ],
  },
};

export default nextConfig;
