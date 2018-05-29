const path = require('path');
const entry = process.env.NODE_ENV === 'production' ?
    path.resolve(__dirname, '../src/entry.js') :
    path.resolve(__dirname, '../src/entry-dev.js');

module.exports = {
    paths: {
        entry: entry,
        public: path.resolve(__dirname, '../dist'),
        src: path.resolve(__dirname, '../src'),
        presentationalComponents: path.resolve(__dirname, '../src/PresentationalComponents'),
        smartComponents: path.resolve(__dirname, '../src/SmartComponents'),
        pages: path.resolve(__dirname, '../src/pages'),
        static: path.resolve(__dirname, '../static')
    }
};
