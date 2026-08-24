import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {
  DefinePlugin,
  HtmlRspackPlugin,
  NormalModuleReplacementPlugin,
} from '@rspack/core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const uniwindDirectory = path.dirname(require.resolve('uniwind/package.json'));
const {generate: generateUniwind} = require('./scripts/generate-uniwind.cjs');
const uniwindWebStyleSheet = path.join(
  uniwindDirectory,
  'dist/module/components/web/createOrderedCSSStyleSheet.js',
);

class UniwindArtifactsPlugin {
  apply(compiler) {
    compiler.hooks.beforeCompile.tapPromise(
      'UniwindArtifactsPlugin',
      generateUniwind,
    );
  }
}

export default (_env, argv) => {
  const production = argv.mode === 'production';

  return {
    mode: production ? 'production' : 'development',
    experiments: {
      css: true,
    },
    context: __dirname,
    entry: './index.web.js',
    devtool: production ? 'source-map' : 'cheap-module-source-map',
    output: {
      path: path.join(__dirname, 'dist', 'web'),
      filename: production ? 'assets/[name].[contenthash].js' : 'assets/[name].js',
      publicPath: '/',
      clean: true,
    },
    resolve: {
      fullySpecified: false,
      alias: {
        'react-native$': 'react-native-web',
      },
      extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /node_modules[\\/]uniwind[\\/].*\.js$/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.css$/,
          type: 'css',
        },
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {syntax: 'typescript', tsx: true},
                transform: {
                  react: {runtime: 'automatic', development: !production, refresh: false},
                },
              },
            },
          },
        },
      ],
    },
    plugins: [
      new UniwindArtifactsPlugin(),
      new NormalModuleReplacementPlugin(
        /^\.\/createOrderedCSSStyleSheet$/,
        resource => {
          if (resource.context.includes('react-native-web')) {
            resource.request = uniwindWebStyleSheet;
          }
        },
      ),
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
      }),
      new HtmlRspackPlugin({
        title: 'Minute Work — EMOM Timer',
        templateContent: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#F7F4ED" />
    <meta name="description" content="A focused every-minute-on-the-minute workout timer." />
    <style>
      html, body, #root { width: 100%; min-height: 100%; margin: 0; }
      body { background: #F7F4ED; font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      button, input { font: inherit; }
      * { box-sizing: border-box; }
    </style>
  </head>
  <body><div id="root"></div></body>
</html>`,
      }),
    ],
    devServer: {
      port: 3000,
      hot: true,
      historyApiFallback: true,
      client: {overlay: true},
    },
  };
};
