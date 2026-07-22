import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const root = import.meta.dirname;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(root, './src'),
      '@assets': path.resolve(root, './src/assets'),
      '@components': path.resolve(root, './src/components'),
      '@pages': path.resolve(root, './src/pages'),
      '@layouts': path.resolve(root, './src/layouts'),
      '@hooks': path.resolve(root, './src/hooks'),
      '@services': path.resolve(root, './src/services'),
      '@store': path.resolve(root, './src/store'),
      '@routes': path.resolve(root, './src/routes'),
      '@utils': path.resolve(root, './src/utils'),
      '@config': path.resolve(root, './src/config'),
      '@contexts': path.resolve(root, './src/contexts'),
      '@schemas': path.resolve(root, './src/schemas'),
      '@styles': path.resolve(root, './src/assets/styles'),
      '@data': path.resolve(root, './src/data'),
      '@mock': path.resolve(root, './src/mock'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
