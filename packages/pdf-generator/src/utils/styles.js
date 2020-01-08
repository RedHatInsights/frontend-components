/* eslint-disable camelcase */
import { StyleSheet, Font } from '@react-pdf/renderer';
import {
    global_danger_color_100,
    global_Color_dark_100,
    chart_global_warning_Color_100,
    global_disabled_color_100,
    global_Color_light_300,
    chart_global_warning_Color_200
} from '@patternfly/react-tokens';
import { fontTypes, generateFonts } from './fonts';

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
        color: global_danger_color_100.value
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
        color: global_Color_dark_100.value
    },
    firstTitle: {
        fontSize: 9,
        fontWeight: 700,
        color: global_danger_color_100.value
    },
    secondTitle: {
        fontWeight: 700,
        fontSize: 9,
        color: global_disabled_color_100.value
    },
    thirdTitle: {
        fontSize: 9,
        color: global_Color_light_300.value
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    flexColumn: {
        display: 'flex',
        flexDirection: 'column'
    },
    colorCrit: {
        color: global_danger_color_100.value
    },
    colorHigh: {
        color: chart_global_warning_Color_100.value
    },
    colorMedium: {
        color: chart_global_warning_Color_200.value
    },
    defaultColor: {
        color: global_Color_light_300.value
    }
});
