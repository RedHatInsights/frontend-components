import React from 'react';
import ReactDOM from 'react-dom';
import { CircleIconConfig } from '@patternfly/react-icons/dist/js/icons/circle-icon';
import PropTypes from 'prop-types';
import { View, Canvas, Text } from '@react-pdf/renderer';
import { ChartBar } from '@patternfly/react-charts/dist/js/components/ChartBar';
import { ChartPie } from '@patternfly/react-charts/dist/js/components/ChartPie';
import { ChartDonut } from '@patternfly/react-charts/dist/js/components/ChartDonut';
import { ChartDonutUtilization } from '@patternfly/react-charts/dist/js/components/ChartDonutUtilization';
import { getLightThemeColors } from '@patternfly/react-charts/dist/js/components/ChartUtils/chart-theme';
import Table from './Table';
import styles from '../utils/styles';
import rgbHex from 'rgb-hex';
import flatten from 'lodash/flatten';
import globalPaletteBlack300 from '@patternfly/react-tokens/dist/js/global_palette_black_300';
import globalPaletteBlack700 from '@patternfly/react-tokens/dist/js/global_palette_black_700';

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
        width: 80,
        translate: {
            x: 100,
            y: 100
        }
    },
    bar: {
        component: ChartBar,
        width: 200,
        height: 100,
        scale: 0.34,
        lineChart: true,
        translate: {
            x: 100,
            y: 0
        }
    },
    donut: {
        component: ChartDonut,
        width: 80,
        translate: {
            x: 100,
            y: 100
        }
    },
    donutUtilization: {
        component: ChartDonutUtilization,
        width: 80,
        colorScale: ([ color ]) => [ color, ...getLightThemeColors('gray').voronoi.colorScale ],
        translate: {
            x: 100,
            y: 100
        }
    }
};

const calcRoundPerc = (data) => {
    const sum = data.reduce((sum, val) => val.y + sum, 0);
    const percData = data.map(x => ({ ...x, y: x.y / sum * 100 }));
    // round down percentage, calculate error margin, sort by error
    const roundedPerc = percData.map(({ y, ...rest }) => (
        { y: Math.floor(y), err: Math.sqrt(y) * Math.abs(y - Math.floor(y)), ...rest })
    ).sort((a, b) => a.err < b.err ? 1 : -1);
    const percSum = roundedPerc.reduce((sum, a) => a.y + sum, 0);
    // distribute reminder % points to make 100%
    const hundredPerc = roundedPerc.map((val, i) => i < 100 - percSum ? { ...val, y: val.y + 1 } : val);
    return hundredPerc;
};

class Chart extends React.Component {
    getChartData = (currChart) => {
        const { data, chartType, colorSchema, ...props } = this.props;
        const newData = calcRoundPerc(data);
        const Chart = currChart.component;
        const el = document.createElement('div');
        document.body.appendChild(el);
        el.style.display = 'none';
        ReactDOM.render(
            <Chart data={newData.sort((a, b) => a.y < b.y ? 1 : -1) } {...currChart.chartProps} { ...props } />,
            el
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
        const { data, chartType, colorSchema, legendHeader, ...props } = this.props;
        const currChart = chartMapper[chartType] || chartMapper.pie;

        const colors = currChart.colorScale
            ? currChart.colorScale(getLightThemeColors(colorSchema).voronoi.colorScale)
            : getLightThemeColors(colorSchema).voronoi.colorScale;

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
                    height: currChart.height || 67
                }}
                paint={({ path, text, moveTo, lineTo, stroke, fill, scale, translate, fontSize, fillColor }) => {
                    paths.map((onePath, key) => {
                        scale(key === 0 ? 0.34 : 1);
                        translate(
                            key === 0 ? currChart.translate.x : 0,
                            key === 0 ? currChart.translate.y : 0
                        );
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

                    if (currChart.lineChart) {
                        let xshift = 35;
                        let yshift = -35;
                        const total = data.length;
                        const [ maxY ] = [ ...data ].sort((a, b) => b.y - a.y);
                        let stepper = maxY.y < total ? parseFloat(maxY.y / total).toFixed(1) : Math.ceil(maxY.y / total);
                        stepper = stepper === 0 ? total : stepper;

                        moveTo(0, 0);
                        lineTo(0, 250);
                        lineTo(500, 250);
                        stroke(globalPaletteBlack300.value);
                        fontSize(18);
                        fillColor(globalPaletteBlack700.value);

                        for (let i = 0; i < total; i++) {
                            let valueY = String(Number.isInteger(i * stepper) ? i * stepper : (i * stepper).toFixed(1));
                            let valueX = String(data[i].name);

                            xshift += i === 0 ? 0 : 120;
                            // y-axis labels
                            text(valueY, yshift - valueY.length, 240 - (Math.ceil(240 / total) * i));
                            // x-axis labels
                            text(valueX, xshift, 260);
                        }
                    }
                }}
            />
            { props.legend &&
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
                        [ legendHeader ],
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
            }
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
    ]),
    legend: PropTypes.bool,
    legendHeader: PropTypes.string,
    data: PropTypes.array,
    chartType: PropTypes.string
};
Chart.defaultProps = {
    colorSchema: 'multiOrdered',
    legend: true,
    legendHeader: 'Legend'
};

export default Chart;
