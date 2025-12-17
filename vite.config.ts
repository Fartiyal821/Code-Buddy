import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    base: '/Code-Buddy/',
    define: {
      // Polyfill process.env.API_KEY for the browser environment
      // Fallback to empty string to prevent undefined errors during replacement
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
    },
  };
});