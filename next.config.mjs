/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        typedRoutes: true,
        scrollRestoration: true,
    },
    typescript: {
        tsconfigPath: './tsconfig.build.json',
    },
    webpack: (config, { isServer }) => {
        // コンテキストの問題を解決するための設定
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
        };
        return config;
    }
};

export default nextConfig;
