const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    port: 8080,
    host: '127.0.0.1',
    open: true
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
  chainWebpack: config => {
    config.module
      .rule('images')
      .test(/\.(jpg|png|gif)$/)
      .set('parser', {
        dataUrlCondition: {
          maxSize: 10 * 1024 // 10KiB
        }
      })
  }
})
