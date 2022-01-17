import replace from 'rollup-plugin-replace';

const rollupPlugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
];

export default rollupPlugins;
