import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const uniwindDirectory = path.dirname(require.resolve('uniwind/package.json'));
const { generate: generateUniwind } = require('./scripts/generate-uniwind.cjs');

class UniwindArtifactsPlugin {
  apply(compiler) {
    compiler.hooks.beforeCompile.tapPromise(
      'UniwindArtifactsPlugin',
      generateUniwind,
    );
  }
}

/**
 * Rspack configuration enhanced with Re.Pack defaults for React Native.
 *
 * Learn about Rspack configuration: https://rspack.dev/config/
 * Learn about Re.Pack configuration: https://re-pack.dev/docs/guides/configuration
 */

export default Repack.defineRspackConfig({
  context: __dirname,
  entry: './index.js',
  resolve: {
    ...Repack.getResolveOptions(),
    alias: {
      'uniwind$': path.join(uniwindDirectory, 'src/index.ts'),
      'uniwind/components$': path.join(
        uniwindDirectory,
        'src/components/index.ts',
      ),
    },
  },
  module: {
    rules: [
      {
        test: /\.[cm]?[jt]sx?$/,
        type: 'javascript/auto',
        use: {
          loader: '@callstack/repack/babel-swc-loader',
          parallel: true,
          options: {},
        },
      },
      ...Repack.getAssetTransformRules(),
    ],
  },
  plugins: [new UniwindArtifactsPlugin(), new Repack.RepackPlugin()],
});
