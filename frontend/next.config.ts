import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  // @ts-ignore - Next.js 16 agentRules flag
  agentRules: false,
};

export default nextConfig;
