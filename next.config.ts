import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const githubBasePath = isGitHubPages ? '/my_tarot' : '';

const nextConfig: NextConfig = {
  output: isGitHubPages ? 'export' : undefined,
  basePath: githubBasePath,
  assetPrefix: githubBasePath,
  trailingSlash: isGitHubPages,
  images: {
    unoptimized: isGitHubPages,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: githubBasePath,
  },
};

export default nextConfig;
