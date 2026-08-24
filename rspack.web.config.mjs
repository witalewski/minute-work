import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {DefinePlugin, HtmlRspackPlugin} from '@rspack/core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default (_env, argv) => {
  const production = argv.mode === 'production';

  return {
    mode: production ? 'production' : 'development',
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
      alias: {
        'react-native$': 'react-native-web',
      },
      extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
    },
    module: {
      rules: [
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
