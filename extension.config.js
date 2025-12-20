export default {
    config: (config) => {
        // resolve設定: 拡張子なしのインポートを許可
        config.resolve = config.resolve || {};
        config.resolve.extensions = [".ts", ".tsx", ".js", ".jsx", ".json", ".mjs"];
        config.resolve.fullySpecified = false;

        // すべての.js/.mjsファイルに対してfullySpecifiedを無効化
        config.module = config.module || {};
        config.module.rules = config.module.rules || [];

        config.module.rules.push({
            test: /\.m?js$/,
            resolve: {
                fullySpecified: false,
            },
        });

        return config;
    },
};
