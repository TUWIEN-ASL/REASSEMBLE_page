import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import path from 'path';
import react from '@vitejs/plugin-react'

/** @type {import("vite").UserConfig} */
const config = {
  plugins: [wasm(), topLevelAwait(), react()],
  optimizeDeps: {
    exclude: process.env.NODE_ENV === "production" ? [] : ["@rerun-io/web-viewer"],
  },
  // publicDir: 'static',
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    copyPublicDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        viewer: 'viewer.html'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'path': 'path-browserify'
    }
  }
};

if ("REPOSITORY" in process.env) {
  config.base = `/${process.env.REPOSITORY}/`;
}

export default config;

// import { defineConfig } from 'vite'

// export default defineConfig({
//   base: './', // This is important for GitHub Pages
//   publicDir: 'static',
//   build: {
//     outDir: 'dist',
//     assetsDir: 'assets',
//   }
// })