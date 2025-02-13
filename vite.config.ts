import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '',
  plugins: [
        createHtmlPlugin({
          minify: true,
        }),
        viteStaticCopy({
          targets: [
            {
              src: 'icons',
              dest: '',
            },
            ...(process.env.INCLUDE_SDK === 'true' ? [{
              src: 'sdk.js',
              dest: '',
            }] : []),
          ],
        }),
      ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        assetFileNames: '[name][extname]',
        chunkFileNames: '[name].js',
        entryFileNames: '[name].js',
      },
    },
  },
});