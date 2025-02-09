import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from '@rollup/plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import json from '@rollup/plugin-json';
import strip from '@rollup/plugin-strip';
import dts from 'rollup-plugin-dts';

const pkg = require('./package.json');

const libraryName = 'ans-validation';

/**
 * Include all of the dependencies here to exclude all node modules from the build
 * Make sure to also include node libraries you're using e.g. 'crypto'
 */

// const external = [...Object.keys(pkg.dependencies || {})];
const external = ['lodash', 'utf8', 'url'];

/**
 * Include all of the dependencies again here to squash rollup warnings
 */
const outputGlobals = {};

// tslint:disable-next-line
export default [{
  input: `src/index.ts`,
  output: [
    {
      file: pkg.main,
      name: libraryName,
      format: 'umd',
      globals: outputGlobals,
      sourcemap: true,
    },
    { file: pkg.module, format: 'es', globals: outputGlobals, sourcemap: true },
  ],

  // exclude all node modules
  external,

  watch: {
    include: 'src/**',
  },
  plugins: [
    builtins(),
    nodeResolve({ mainFields: ['module', 'jsnext:main', 'main', 'browser'] }),
    commonjs({
      exclude: ['node_modules/rollup-plugin-node-globals/**'],
      namedExports: {
        './node_modules/punycode/punycode.js': ['toUnicode'],
        './node_modules/rollup-plugin-node-builtins/src/es6/url.js': ['Url'],
        './node_modules/xregexp/lib/index.js': ['OuterXRegExp'],
      },
    }),
    globals(),
    json(),
    // Compile TypeScript files
    typescript({
      //useTsconfigDeclarationDir: true,
      tsconfig: './tsconfig-build.json',
      //verbosity: 3,
    }),
    // Resolve source maps to the original source
    sourceMaps(),
    strip({
      include: ['**/*.ts']
    })
  ],
}
/*, {
  // path to your declaration files root
  input: './dist/types/index.d.ts',
  output: [{ file: 'dist/index.d.ts', format: 'es' }],
  plugins: [dts.default()],
}*/
];
