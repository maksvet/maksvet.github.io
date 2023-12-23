module.exports = function override(config, env) {
    // Do stuff with the webpack config...
    config.resolve.fallback = {
        ...config.resolve.fallback, // if you already have fallback object
        "stream": require.resolve('stream-browserify'),
        "buffer": require.resolve('buffer/'),
        "path": require.resolve('path-browserify'),
        "os": require.resolve('os-browserify/browser'),
        "crypto": require.resolve('crypto-browserify')
    };
    return config;
};
