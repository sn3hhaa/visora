import type { NextConfig } from "next";

/** Sub-path the site is served from, e.g. "/visora" on GitHub Pages. Empty for local and root deployments. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;
/** Static HTML export for hosts without a Node server (GitHub Pages). Every route is already static. */
const staticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  devIndicators: false,
  agentRules: false,
  basePath,
  ...(staticExport && {
    output: "export",
    // Pages serves /results/index.html for /results/; without this, deep links 404.
    trailingSlash: true,
    // There is no image optimisation server on a static host.
    images: { unoptimized: true },
  }),
};

export default nextConfig;
