import type { NextConfig } from 'next';

// GitHub Pages serves the site from /<repo>/. Locally the site lives at the root.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

const config: NextConfig = {
  output: 'export',
  basePath: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default config;
