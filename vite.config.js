import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@/components': path.resolve(__dirname, './Components'),
      '@/Components': path.resolve(__dirname, './Components'),
      '@/Pages': path.resolve(__dirname, './Pages'),
      '@/pages': path.resolve(__dirname, './Pages'),
      '@/api': path.resolve(__dirname, './api'),
      '@/utils': path.resolve(__dirname, './utils.js'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  server: {
    port: 3000,
    open: true,
  },
});
