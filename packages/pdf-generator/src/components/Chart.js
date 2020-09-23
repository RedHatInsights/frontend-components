import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { CircleIconConfig } from '@patternfly/react-icons/dist/js/icons/circle-icon';
import PropTypes from 'prop-types';
import { View, Canvas, Text } from '@react-pdf/renderer';
import { ChartPie } from '@patternfly/react-charts/dist/js/components/ChartPie';
import { ChartDonut } from '@patternfly/react-charts/dist/js/components/ChartDonut';
import { ChartDonutUtilization } from '@patternfly/react-charts/dist/js/components/ChartDonutUtilization';
import { getLightThemeColors } from '@patternfly/react-charts/dist/js/components/ChartUtils/chart-theme';
import Table from './Table';
import styles from '../utils/styles';
import rgbHex from 'rgb-hex';
import flatten from 'lodash/flatten';

const appliedStyles = styles();

const chartMapper = {
    pie: {
        component: ChartPie,
        chartProps: {
            allowTooltip: false,
            labelRadius: 45,
            labels: ({ datum }) => `${datum.y}%`,
            style: { labels: { fill: '#FFFFFF' } }
        },
        showLabels: true,
        width: 80
    },
    donut: {
        component: ChartDonut,
        width: 80
    },
    donutUtilization: {
        component: ChartDonutUtilization,
        width: 80,
        colorScale: ([ color ]) => [ color, ...getLightThemeColors('gray').voronoi.colorScale ]
    }
};

class Chart extends Component {
    getChartData = (currChart) => {
        const { data, chartType, colorSchema, ...props } = this.props;
        const Chart = currChart.component;
        const el = document.createElement('div');
        document.body.appendChild(el);
        el.style.display = 'none';
        ReactDOM.render(
            <Chart data={ data } {...currChart.chartProps} { ...props } />,
            el,
        );

        const paths = Array.from(el.querySelectorAll('path')).map((path) => path.getAttribute('d'));
        const texts = flatten(Array.from(el.querySelectorAll('text')).map((textEl, key) => (
            Array.from(textEl.querySelectorAll('tspan')).map((text) => ({
                text: text.innerHTML,
                ...currChart.showLabels && {
                    coords: [ textEl.getAttribute('x'), textEl.getAttribute('y') ],
                    shift: data[key]?.y < 20 ? 0.65 : 0
                },
                style: text.getAttribute('style').split(';').reduce((acc, curr) => {
                    const [ key, val ] = curr.split(':');
                    return {
                        ...acc,
                        ...key && { [key.trim()]: val.trim() }
                    };
                }, {})
            }))
        )));
        // let's clean up the placeholder chart
        ReactDOM.unmountComponentAtNode(el);
        el.remove();

        return [ paths, texts ];
    }

    render() {
        const { data, chartType, colorSchema, ...props } = this.props;
        const currChart = chartMapper[chartType] || chartMapper.pie;

        const colors = currChart.colorScale ?
            currChart.colorScale(getLightThemeColors(colorSchema).voronoi.colorScale) :
            getLightThemeColors(colorSchema).voronoi.colorScale;
        const [ paths, texts ] = this.getChartData(currChart);

        return <View style={[
            appliedStyles.flexRow,
            {
                paddingLeft: 30,
                paddinRight: 10,
                justifyContent: 'flex-start'
            }
        ]}>
            <Canvas
                {...props}
                style={{
                    width: currChart.width,
                    height: 67
                }}
                paint={({ path, text, fill, scale, translate }) => {
                    paths.map((onePath, key) => {
                        scale(key === 0 ? 0.34 : 1);
                        translate(key === 0 ? 100 : 0, key === 0 ? 100 : 0);
                        path(onePath)
                        .fill(colors[key]);
                        const currText = texts[key];
                        if (currText) {
                            const fontSize = parseInt(currText.style['font-size'].replace('px', '')) * 2;
                            const coords = currText.coords;
                            const color = rgbHex(
                                ...currText
                                .style
                                .fill
                                .replace(/rgb\(|\)/g, '')
                                .split(',')
                                .map(item => parseInt(item, 10))
                            );
                            fill(`#${color}`).fontSize(fontSize);
                            if (coords) {
                                const [ xshift, yshift ] = [
                                    coords?.[0] > (fontSize + currChart.width) ?
                                        0.5 :
                                        -2 + (currText?.shift || 0),
                                    coords?.[1] > 100 ?
                                        coords?.[0] < (fontSize + currChart.width) ? 0.5 : 1
                                        : -2 - (currText?.shift || 0)
                                ];
                                text(currText.text, xshift * fontSize, yshift * fontSize);
                            } else {
                                text(currText.text, -(currText.text.length * (fontSize / 4)), (24 * key) - fontSize);
                            }
                        }
                    });
                }
                }
            />
            <Table
                withHeader
                style={
                    { width: 'auto', flex: 1 }
                }
                rowsStyle={{
                    justifyContent: 'flex-start',
                    ...appliedStyles.compactCellPadding
                }}
                rows={[
                    [ 'Legend' ],
                    ...(Array.isArray(data) ? data : [ data ]).map(({ x, y }, key) => [
                        <Canvas
                            key={`${key}-bullet`}
                            style={{
                                padding: 3,
                                width: 15,
                                height: 10
                            }}
                            paint={({ path, scale }) => {
                                scale(0.014);
                                path(CircleIconConfig.svgPath).fill(colors[key]);
                            }}
                        />,
                        <Text key={`${key}-text`}>
                            {x}
                        </Text>
                    ])
                ]}
            />
        </View>;
    }
}

Chart.propTypes = {
    colorSchema: PropTypes.oneOf([
        'blue',
        'cyan',
        'default',
        'gold',
        'gray',
        'green',
        'multi',
        'multiOrdered',
        'multiUnordered',
        'orange',
        'purple'
    ])
};
Chart.defaultProps = {
    colorSchema: 'multiOrdered'
};

export default Chart;
