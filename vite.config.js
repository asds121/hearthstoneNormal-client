import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
  // 配置根目录
  root: '.',
  
  // 配置服务
  server: {
    port: 8089,
    host: true,
    open: true,
    // 配置代理，处理扩展资源请求
    proxy: {
      '/extension': {
        target: path.resolve('../'),
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
  
  // 配置构建
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'hearthstone-app.html')
      }
    }
  },
  
  // 配置插件
  plugins: [
    // 静态资源复制插件，将扩展资源复制到输出目录
    viteStaticCopy({
      targets: [
        {
          src: '../extension',
          dest: '.'
        }
      ]
    })
  ],
  
  // 配置解析
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './js')
    }
  }
});
