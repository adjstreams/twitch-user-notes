import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({

  server: {
    open: '/options/options.html', // or popup.html if you prefer
    port: 5173,
  },
  root: 'src',
  publicDir: '../public',
  plugins: [
    viteStaticCopy({
      targets: [
        { src: '../public/manifest.json', dest: '.' },
        { src: '../public/icons', dest: '.' }
      ]
    })
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: [
      '__tests__/e2e/**', // 👈 exclude E2E test folder from Vitest
    ],    
    coverage: {
      all: true,
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: '../coverage',
      include: ['**/*.{ts,tsx}'],
      exclude: ['types/**', '__tests__/**', '**/*.spec.ts']
    }    
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    modulePreload: { 
      polyfill: false,
    },
    rollupOptions: {
      input: {
        options: resolve(__dirname, 'src/options/options.html'),
        popup: resolve(__dirname, 'src/popup/popup.html'),
        background: resolve(__dirname, 'src/background.ts'),
        content: resolve(__dirname, 'src/content.ts')
      },
      output: {
        entryFileNames: ({ name }) => {
          if (['background', 'content'].includes(name ?? '')) return '[name].js'; // root-level files
          return '[name]/[name].js'; // nested like popup/popup.js
        },
        chunkFileNames: '[name]/[name].js',
        assetFileNames: ({ name }) => {
          if (name?.includes('options')) return 'options/[name][extname]';
          if (name?.includes('popup')) return 'popup/[name][extname]';
          return '[name][extname]';
        }
      }
    }
  }
});
