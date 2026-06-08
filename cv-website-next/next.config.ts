import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next.js doesn't mis-infer it from stray
  // lockfiles further up the tree (e.g. ~/package-lock.json).
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
