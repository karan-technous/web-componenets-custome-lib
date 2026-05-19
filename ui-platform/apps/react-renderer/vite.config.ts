import { defineConfig, type Connect, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import {
  cpSync,
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { join } from 'node:path';

const stencilAssetsDir = join(__dirname, '../../packages/web-components/dist/esm');

function stencilAssetsPlugin(): Plugin {
  return {
    name: 'stencil-assets',
    configureServer(server) {
      const serveStencilAsset: Connect.NextHandleFunction = (req, res, next) => {
        const assetName = req.url?.replace(/^\//, '').split('?')[0];
        if (!assetName) {
          next();
          return;
        }

        const assetPath = join(stencilAssetsDir, assetName);
        if (!existsSync(assetPath) || !statSync(assetPath).isFile()) {
          next();
          return;
        }

        res.setHeader('Content-Type', 'text/javascript');
        createReadStream(assetPath).pipe(res);
      };

      server.middlewares.use('/assets', serveStencilAsset);
    },
    closeBundle() {
      if (!existsSync(stencilAssetsDir)) {
        return;
      }

      const outputDir = join(__dirname, 'dist/assets');
      mkdirSync(outputDir, { recursive: true });

      for (const file of readdirSync(stencilAssetsDir)) {
        const source = join(stencilAssetsDir, file);
        if (statSync(source).isFile()) {
          cpSync(source, join(outputDir, file));
        }
      }
    },
  };
}

export default defineConfig({ plugins: [react(), stencilAssetsPlugin()] });
