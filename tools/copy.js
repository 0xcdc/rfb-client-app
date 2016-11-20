/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import gaze from 'gaze';
import { writeFile, copyFile, makeDir, copyDir, cleanDir } from './lib/fs';
import pkg from '../package.json';

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copy() {
  await makeDir('build');
  await Promise.all([
    ncp('node_modules/bootstrap/dist/css', 'build/public/css'),
    ncp('node_modules/bootstrap/dist/fonts', 'build/public/fonts'),
    ncp('src/public', 'build/public'),
    ncp('src/content', 'build/content'),
    ncp('app.yaml', 'build/app.yaml'),
  ]);

  if (process.argv.includes('--watch')) {
    const watcher = await new Promise((resolve, reject) => {
      gaze([
        'src/content/**/*',
        'src/public/**/*',
      ], (err, val) => (err ? reject(err) : resolve(val)));
    });

    watcher.on('all', async (event, filePath) => {
      const dist = path.join('build/', path.relative('src', filePath));
      switch (event) {
        case 'added':
        case 'renamed':
        case 'changed':
          if (filePath.endsWith('/')) return;
          await makeDir(path.dirname(dist));
          await copyFile(filePath, dist);
          break;
        case 'deleted':
          cleanDir(dist, { nosort: true, dot: true });
          break;
        default:
          return;
      }
      console.log(`[file ${event}] ${dist}`);
    });
  }
}

export default copy;
