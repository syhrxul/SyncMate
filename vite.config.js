import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Important for Electron to load assets correctly
  plugins: [
    react(),
    tailwindcss()
  ],
  css: {
  postcss: './postcss.config.js',
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@assets': path.resolve(__dirname, './src/assets')
    }
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          appwrite: ['appwrite'],
          motion: ['framer-motion'],
          icons: ['react-icons', '@appwrite.io/pink-icons']
        }
      }
    }
  },
  define: {
    // Define global constants if needed
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  }
})