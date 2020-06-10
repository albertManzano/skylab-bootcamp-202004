/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
    resolver: {
        extraNodeModules: require('node-libs-react-native'),
        sourceExts: ['jsx', 'js', 'ts', 'tsx'],
    },
    maxWorkers: 2,
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false,
            },
        }),
    },
};
