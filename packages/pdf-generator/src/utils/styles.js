import { StyleSheet, Font } from '@react-pdf/renderer';

const fontBaseUrl = 'https://overpass-30e2.kxcdn.com/';

const fontTypes = [ 'thin', 'extralight', 'light', 'semibold', 'bold', 'extrabold', 'heavy' ];

const generateFonts = (fonts) => {
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

Font.register({ family: 'Overpass', fonts: generateFonts(fontTypes) });

export default (style = {}) => StyleSheet.create({
    ...style,
    page: {
        fontWeight: 500,
        fontFamily: 'Overpass',
        height: '100%',
        padding: '20 50'
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    currDate: {
        alignSelf: 'flex-end',
        marginLeft: 'auto',
        fontSize: 9,
        fontStyle: 'italic',
        color: '#6e6b6c'
    },
    reportName: {
        fontSize: 28,
        color: '#ee2435'
    },
    largeSpacing: {
        margin: '30 0'
    },
    mediumSpacing: {
        margin: '15 0'
    },
    smallSpacing: {
        margin: '7 0'
    },
    text: {
        fontSize: 9,
        color: '#151515'
    },
    firstTitle: {
        fontSize: 9,
        fontWeight: 700,
        color: '#ee2435'
    },
    secondTitle: {
        fontWeight: 700,
        fontSize: 9,
        color: '#4f4c4d'
    },
    thirdTitle: {
        fontSize: 9,
        color: '#6e6b6c'
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    colorCrit: {
        color: '#c9190b'
    },
    colorHigh: {
        color: '#ec7a08'
    },
    colorMedium: {
        color: '#f0ab00'
    },
    defaultColor: {
        color: '#d2d2d2'
    }
});
