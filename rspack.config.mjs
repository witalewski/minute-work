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

class OfflineDevClientPlugin {
  apply(compiler) {
    if (compiler.options.devServer) {
      return;
    }

    // Re.Pack 5.3 injects its dev client even into embedded debug bundles,
    // where DevelopmentPlugin does not define __PUBLIC_HOST__ and friends.
    // Use RN's no-op client when there is no dev server to connect to.
    new compiler.webpack.NormalModuleReplacementPlugin(
      /react-native[/\\].*[/\\]HMRClient\.js$/,
      require.resolve('react-native/Libraries/Utilities/HMRClientProdShim.js'),
    ).apply(compiler);
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
  plugins: [
    new UniwindArtifactsPlugin(),
    // Run before Re.Pack replaces HMRClient with its dev-server client.
    new OfflineDevClientPlugin(),
    new Repack.RepackPlugin(),
  ],
});
