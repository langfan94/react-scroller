import { swc } from 'rollup-plugin-swc3';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.jsx',
  external: ['react', 'react-dom'],
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs'
    },
    {
      file: 'dist/es/index.js',
      format: 'es'
    },
    {
      name: 'index',
      file: 'dist/umd/index.js',
      format: 'umd'
    }
  ],
  plugins: [
    postcss({
      minimize: true,
      modules: false,
      use: {
        sass: null,
        stylus: null,
        less: { javascriptEnabled: true }
      },
      extract: false
    }),
    resolve(),
    commonjs(),
    // typescript(),
    json(),
    swc({
      // All options are optional
      include: /\.[jt]sx?$/, // default
      exclude: /node_modules/, // default
      // tsconfig: 'tsconfig.json', // default
      // And add your swc configuration here!
      // "filename" will be ignored since it is handled by rollup
      jsc: {}
    }),
  ],
};