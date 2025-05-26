const {terser} = require('../../../node_modules/rollup-plugin-terser/rollup-plugin-terser.js');

function isEnvVarTrue(envVar) {
  return envVar === 'true';
}

// eslint-disable-next-line import/no-default-export
export default {
  treeshake: false,
  output: [{format: 'iife'}],
  plugins: !isEnvVarTrue(process.env.DEBUG_CHII_APP) ? [terser()] : []
};
