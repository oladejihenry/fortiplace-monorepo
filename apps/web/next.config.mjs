/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ['@workspace/ui'],
  images: {
    remotePatterns: [{hostname: "images.unsplash.com"}, 
      {hostname: "www.vectorlogo.zone"}, 
      {hostname: "lon1.digitaloceanspaces.com"},
      {hostname: "localhost"},
      {hostname: "creating.lon1.cdn.digitaloceanspaces.com"},
      {hostname: "contents.fortiplace.com"},
      {hostname: "cdn.fortiplacecdn.com"},
      {hostname: "lh3.googleusercontent.com"},
      {hostname: "pbs.twimg.com"}
    ],
  },
};

export default nextConfig;
