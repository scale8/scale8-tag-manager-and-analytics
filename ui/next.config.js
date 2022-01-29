const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    webpack(config) {
        if (process.env.ANALYZE) {
            config.plugins.push(
                new BundleAnalyzerPlugin({
                    analyzerMode: 'server',
                    analyzerPort: 8888,
                    openAnalyzer: true,
                })
            );
        }
        return config;
    }
};
