module.exports = {
    extends: './babel.config.js',
    env: {
        cjs: {
            presets: [ [ '@babel/preset-env', { modules: 'commonjs' }] ],
            plugins: [
                [
                    './plugins/transform-scss-plugin'
                ]
            ]
        },
        esm: {
            presets: [ [ '@babel/preset-env', { modules: false }] ],
            plugins: [
                [
                    './plugins/transform-scss-plugin',
                    {
                        esm: true
                    }
                ]
            ]
        }
    }
};
