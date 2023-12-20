/* eslint-disable no-dupe-keys */
/* eslint-disable no-undef */
const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
module.exports = defineConfig({
  productionSourceMap: false, //  生产环境的构造
  publicPath: './', // 根目录
  outputDir: 'dist',
  transpileDependencies: true,
  assetsDir: 'assets',
  lintOnSave: false,
  devServer: {
    port: 7276, //开发运行时的端口
    host: '0.0.0.0', // 开发运行时域名
    https: false, // 是否启用 https
    open: true
  },
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ]
  }
})
