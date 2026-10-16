/**
 * Prefixes a `public/` path with the deployment base path. Next.js adds `basePath` to links and
 * its own assets, but not to plain string `src` values, so images need this when the site is
 * served from a sub-path (e.g. GitHub Pages at /visora).
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
