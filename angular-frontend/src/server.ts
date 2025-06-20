import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

// ------------------------------
// 🛠 Path Setup
// ------------------------------
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

// ------------------------------
// 🚀 Create Express + Angular SSR Engine
// ------------------------------
const app = express();
const angularApp = new AngularNodeAppEngine();

// ------------------------------
// 📁 Serve Static Assets
// ------------------------------
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// ------------------------------
// 🔁 Angular SSR Catch-all Route
// ------------------------------
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

// ------------------------------
// 🟢 Start Server (if run directly)
// ------------------------------
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`✅ Node Express server listening at http://localhost:${port}`);
  });
}

// ------------------------------
// 📦 Export Request Handler (for Firebase, Azure, etc.)
// ------------------------------
export const reqHandler = createNodeRequestHandler(app);
