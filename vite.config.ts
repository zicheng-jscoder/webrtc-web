import vue from '@vitejs/plugin-vue'
import { CSSOptions, defineConfig, loadEnv, ServerOptions } from 'vite'
import path from 'path'
import fs from 'fs'
import pxtovw from 'postcss-px-to-viewport'
import autoProfixer from 'autoprefixer'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // console.log(env)
  return {
    envDir: './',
    publicDir: 'public',
    base: './',
    css: resolveCssModules(),
    plugins: [
      vue(),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue'],
      }),
    ],
    server: resolvedServerOptions(env),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '~@': path.resolve(__dirname, 'src/static'),
        '~com': path.resolve(__dirname, 'src/components'),
      },
    },
    define: {
      'process.env': env,
    },
  }
})

// 处理server 逻辑
function resolvedServerOptions(env) {
  const proxy = {
    [env.VITE_PROXY_KEY as string]: {
      target: env.VITE_BASE_API_URL,
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(env.VITE_PROXY_KEY, ''),
    },
  }

  const server: ServerOptions = {
    port: 3000,
    https: {
      cert: fs.readFileSync(path.join(__dirname, 'src/ssl/cert.crt')),
      key: fs.readFileSync(path.join(__dirname, 'src/ssl/cert.key')),
    },
    open: 'index.html',
    proxy,
    host: true,
  }
  return server
}

// css预处理器
function resolveCssModules(): CSSOptions {
  const px2vw750 = pxtovw({
    unitToConvert: 'px', // 要转化的单位
    viewportWidth: 750, // UI设计稿的宽度
    unitPrecision: 6, // 转换后的精度，即小数点位数
    propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
    viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
    fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
    selectorBlackList: [], // 指定不转换为视窗单位的类名，
    minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
    mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
    replace: true, // 是否转换后直接更换属性值
    exclude: /(\/|\\)(node_modules)(\/|\\)/,
    landscape: false, // 是否处理横屏情况
  })

  // 浏览器前缀兼容
  const autoProfixerPlugin = autoProfixer({
    overrideBrowserslist: [
      'Android 4.1',
      'iOS 7.1',
      'Chrome > 31',
      'ff > 31',
      'ie >= 8',
      '> 1%',
    ],
    grid: true,
  })
  return {
    preprocessorOptions: {
      // less全局入口文件
      less: {
        charset: false,
        additionalData: '@import "./src/style.less";',
      },
    },
    postcss: {
      plugins: [px2vw750, autoProfixerPlugin],
    },
  }
}
