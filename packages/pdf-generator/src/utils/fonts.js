const fontBaseUrl = 'https://overpass-30e2.kxcdn.com/';
const RHFontUrl = (window.location.hostname.includes('foo.redhat.com') || window.location.hostname.includes('cloud.redhat.com'))
    ? `${window.location.origin}/apps/frontend-assets/fonts/RedHat/RedHatDisplay`
    : 'https://raw.githubusercontent.com/RedHatOfficial/RedHatFont/master/fonts/proportional/static/ttf/RedHatDisplay';

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

export const redhatFont = () => {
    const calculateFont = (name, types) => ({
        [name]: types.reduce((acc, curr, key) => ([
            ...[
                {
                    src: `${RHFontUrl}-${curr}.ttf?raw=true`,
                    fontWeight: (key * 100) + 600,
                    fontStyle: 'normal'
                },
                {
                    src: `${RHFontUrl}-${curr}Italic.ttf?raw=true`,
                    fontWeight: (key * 100) + 600,
                    fontStyle: 'italic'
                }
            ],
            ...acc
        ]), [{
            src: `${RHFontUrl}-Regular.ttf?raw=true`,
            fontStyle: 'normal',
            fontWeight: 500
        },
        {
            src: `${RHFontUrl}-Italic.ttf?raw=true`,
            fontStyle: 'italic',
            fontWeight: 500
        }])
    });
    return {
        ...calculateFont('RedHatDisplay', [ 'Medium', 'Bold', 'Black' ]),
        ...calculateFont('RedHatText', [ 'Medium', 'Bold' ])
    };
};
