module.exports = {
    extends: '../../babel.config.js',
    plugins: [
        [
            'babel-plugin-import',
            {
                libraryName: '@patternfly/react-icons',
                libraryDirectory: 'dist/js/icons'
            },
            'react-icons'
        ]
    ]
};
