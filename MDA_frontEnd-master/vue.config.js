module.exports = {
    devServer: {
        port: 8080,
        hot: true,
    },
    // chainWebpack: (config) => {
    //     config.module.rules.delete("svg");
    // },
    // configureWebpack: {
    //     module: {
    //         rules: [
    //             {
    //                 test:/\.svg$/,
    //                 loader: "vue-svg-loader",
    //             },
    //         ],
    //     },
    // },
    chainWebpack: config => {
        const svgRule = config.module.rule("svg");

        svgRule.uses.clear();
        svgRule
            .use("babel-loader")
            .loader("babel-loader")
            .end()
            .use("vue-svg-loader")
            .loader("vue-svg-loader");
    },
    css: {
        // 配置css模块
        loaderOptions: {
            // 向预处理器 Loader 传递配置选项
            less: {
                // 配置less（其他样式解析用法一致）
                javascriptEnabled: true // 设置为true
            }
        }
    },
    // devServer: {
    //     proxy: {
    //         "/api/dev": {
    //             target: "http://localhost:8078/",
    //             ws: true,
    //             changeOrigin: true,
    //             pathRewrite: {
    //                 "^/api/dev": ""
    //             }
    //         },
    //         "/dm": {
    //             target: "<other_url>"
    //         }
    //     }
    // }
};
