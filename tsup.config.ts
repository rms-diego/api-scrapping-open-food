import { Options } from 'tsup';

const config: Options = {
  entryPoints: ['src/**/*.ts'],
  target: 'node14',
  outDir: 'dist',
  format: ['cjs', 'esm'],
  bundle: true,
  sourcemap: true,
};

export default config;
