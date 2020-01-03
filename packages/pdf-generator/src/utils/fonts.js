const fontBaseUrl = 'https://overpass-30e2.kxcdn.com/';

export const fontTypes = [ 'thin', 'extralight', 'light', 'semibold', 'bold', 'extrabold', 'heavy' ];

export const generateFonts = (fonts) => {
    const bla = fonts.reduce((acc, curr, key) => ([
        ...[
            {
                src: `${fontBaseUrl}overpass-${curr}.ttf`,
                fontWeight: (key * (key >= 3 ? 200 : 100)) + 200,
                fontStyle: 'normal'
            },
            {
                src: `${fontBaseUrl}overpass-${curr}-italic.ttf`,
                fontWeight: (key * (key >= 3 ? 200 : 100)) + 200,
                fontStyle: 'italic'
            }
        ],
        ...acc
    ]), [{
        src: `${fontBaseUrl}overpass-regular.ttf`,
        fontStyle: 'normal',
        fontWeight: 500
    }, {
        src: `${fontBaseUrl}overpass-italic.ttf`,
        fontStyle: 'italic',
        fontWeight: 500
    }]);
    return bla;
};
