const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    host: '127.0.0.1',
    // 开启IP或域名访问webpack服务器权限
    historyApiFallback: true,
    allowedHosts: 'www.corho.com'
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      // 哪些less文件自动引入,使用绝对路径 用path.join拼接
      patterns: [
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixins.less')
      ]
    }
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '聚美商城'
      console.log(args)
      return args
    })
    // 开启IP或域名访问webpack服务器权限
    /* config.devServer
      .port('8080')
      // .host('127.0.0.1')
      .allowedHosts.add('www.corho.com').prepend('172.0.0.1')
      .historyApiFallback(true) */
    // config.devServer.disableHostCheck(true)
    // 图片加载
    config.module
      .rule('images')
      .test(/\.(jpg|png|gif)$/)
      .set('parser', {
        dataUrlCondition: {
          maxSize: 10 * 1024 // 10KiB
        }
      })
  },
  // 这个是设置外部扩展，模块为qc变量名为QC，导入qc将不做打包。
  configureWebpack: {
    externals: {
      qc: 'QC'
    }
  }
})
