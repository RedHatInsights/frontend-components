import replace from 'rollup-plugin-replace';

const rollupPlugins = [
    replace({
        'process.env.NODE_ENV': '\'production\''
    })
];

export default rollupPlugins;
