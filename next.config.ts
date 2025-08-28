/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.microcms-assets.io", pathname: "/**" }],
  },
  eslint: {
    ignoreDuringBuilds: true, // ← ビルド時に ESLint エラーで落とさない
  },
};
export default nextConfig;
