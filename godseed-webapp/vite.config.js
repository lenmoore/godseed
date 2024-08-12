import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {}
    }
  },
  build: {
    outDir: 'dist', // Specify the output directory
    sourcemap: true, // Generate source maps for easier debugging in production
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor' // Separate vendor code from the app code
          }
        }
      }
    },
    minify: 'esbuild' // Use esbuild for faster builds
  },
  server: {
    host: true, // Allows access via IP address for network testing
    port: 5173, // Specify the development server port
    open: true, // Automatically open the browser when starting the server
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Proxy API requests to the backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Rewrite the path if necessary
      }
    }
  }
})
