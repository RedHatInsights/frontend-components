import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { CircleIconConfig } from '@patternfly/react-icons/dist/js/icons/circle-icon';
import PropTypes from 'prop-types';
import { View, Canvas, Text, Svg, G, Path, Line } from '@react-pdf/renderer';
import { ChartBar } from '@patternfly/react-charts/dist/js/components/ChartBar';
import { ChartAxis } from '@patternfly/react-charts/dist/js/components/ChartAxis';
import { ChartPie } from '@patternfly/react-charts/dist/js/components/ChartPie';
import { Chart as PFChart } from '@patternfly/react-charts/dist/js/components/Chart';
import { ChartGroup } from '@patternfly/react-charts/dist/js/components/ChartGroup';
import { ChartDonut } from '@patternfly/react-charts/dist/js/components/ChartDonut';
import { ChartLine } from '@patternfly/react-charts/dist/js/components/ChartLine';
import { ChartDonutUtilization } from '@patternfly/react-charts/dist/js/components/ChartDonutUtilization';
import { getLightThemeColors } from '@patternfly/react-charts/dist/js/components/ChartUtils/chart-theme';
import Table from './Table';
import styles from '../utils/styles';
import flatten from 'lodash/flatten';
import { PDFContext } from '../utils/consts';
import Deferred from '@redhat-cloud-services/frontend-components-utilities/Deffered';
import { Fragment } from 'react';

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
            x: 0,
            y: 0
        }
    },
    bar: {
        component: ChartBar,
        width: 100,
        scale: 0.2,
        lineChart: true,
        showLabels: true,
        translate: {
            x: 0,
            y: 0
        }
    },
    donut: {
        component: ChartDonut,
        showLabels: true,
        width: 80,
        translate: {
            x: 0,
            y: 0
        }
    },
    lineChart: {
        component: ChartLine,
        showLabels: true,
        width: 100,
        scale: 0.2,
        translate: {
            x: 0,
            y: 0
        }
    },
    donutUtilization: {
        component: ChartDonutUtilization,
        showLabels: true,
        width: 80,
        colorScale: ([ color ]) => [ color, ...getLightThemeColors('gray').voronoi.colorScale ],
        translate: {
            x: 0,
            y: 0
        }
    }
};

const calcRoundPerc = (data) => {
    const toArr = Array.isArray(data) ? data : [ data ];
    const sum = toArr?.reduce((sum, val) => val.y + sum, 0);
    const percData = toArr?.map(x => ({ ...x, y: x.y / sum * 100 }));
    // round down percentage, calculate error margin, sort by error
    const roundedPerc = percData.map(({ y, ...rest }) => (
        { y: Math.floor(y), err: Math.sqrt(y) * Math.abs(y - Math.floor(y)), ...rest })
    ).sort((a, b) => a.err < b.err ? 1 : -1);
    const percSum = roundedPerc.reduce((sum, a) => a.y + sum, 0);
    // distribute reminder % points to make 100%
    const hundredPerc = roundedPerc.map((val, i) => i < 100 - percSum ? { ...val, y: val.y + 1 } : val);
    return hundredPerc;
};

const getAttFromStyle = (element, type) => element
.getAttribute('style')
?.split?.(';')
?.find(item => item.includes(`${type}: `))
?.replace?.(`${type}: `, '')?.trim();

const getChartData = (currChart, chartProps, wrapperProps, callback) => {
    let { data } = chartProps;
    const { chartType } = currChart;
    const { colorSchema, ...props } = chartProps;

    if (![ 'bar', 'lineChart' ].includes(chartType)) {
        let roundPercData = calcRoundPerc(data);
        // fix sorting caused by rounding function, revert to the initial order
        data = (Array.isArray(data) ? data : [ data ]).map(({ x, y, ...rest }) => ({ x, y: roundPercData.find(item => item.x === x).y, ...rest }));
        data = chartType === 'donutUtilization' ? data[0] : data;
    }

    const Chart = currChart.component;
    const el = document.createElement('div');
    document.body.appendChild(el);
    const Wrapper = [ 'bar', 'lineChart' ].includes(chartType) ? PFChart : Fragment;
    el.style.display = 'none';
    ReactDOM.render(
        <Wrapper {...[ 'bar', 'lineChart' ].includes && {
            domainPadding: { x: [ 30, 25 ] }
        }} {...wrapperProps}>
            {[ 'bar', 'lineChart' ].includes(chartType) && <ChartAxis />}
            {[ 'bar', 'lineChart' ].includes(chartType) && <ChartAxis dependentAxis />}
            {Array.isArray(data?.[0]) ? <ChartGroup>
                {data.map((subChartData, key) => (
                    <Chart key={key}
                        name={key}
                        // domainPadding={{ x: [ 30, 25 ] }}
                        {...currChart.chartProps}
                        { ...props }
                        data={subChartData}
                    />
                ))}
            </ChartGroup> : <Chart data={data} {...currChart.chartProps} { ...props } />}
        </Wrapper>,
        el,
        () => {
            const paths = Array.from(el.querySelectorAll('path')).map((path) => ({
                d: path.getAttribute('d').replaceAll('\n', ''),
                fill: getAttFromStyle(path, 'fill') === 'transparent' ? 'white' : getAttFromStyle(path, 'fill'),
                ...chartType === 'lineChart' && {
                    strokeWidth: getAttFromStyle(path, 'stroke-width'),
                    stroke: getAttFromStyle(path, 'stroke')
                },
                ...path.getAttribute('transform') && { transform: path.getAttribute('transform') }
            }));
            const texts = flatten(Array.from(el.querySelectorAll('text')).map((textEl, key) => (
                Array.from(textEl.querySelectorAll('tspan')).map((text) => ({
                    text: text.innerHTML,
                    textAnchor: text.getAttribute('text-anchor'),
                    ...currChart.showLabels && {
                        coords: [
                            parseInt(textEl.getAttribute('x'), 10) + parseInt(text.getAttribute('dx')),
                            parseInt(textEl.getAttribute('y'), 10) + parseInt(text.getAttribute('dy'))
                        ],
                        shift: data[key]?.y < 20 ? 18 : 0
                    },
                    style: text.getAttribute('style').split(';').reduce((acc, curr) => {
                        const [ key, val ] = curr.split(':');
                        return {
                            ...acc,
                            ...key && { [key?.trim()]: val?.trim() }
                        };
                    }, {})
                }))
            )));
            const lines = flatten(Array.from(el.querySelectorAll('line')).map((line) => ({
                x1: line.getAttribute('x1'),
                y1: line.getAttribute('y1'),
                x2: line.getAttribute('x2'),
                y2: line.getAttribute('y2'),
                stroke: getAttFromStyle(line, 'stroke'),
                strokeWidth: getAttFromStyle(line, 'stroke-width')
            })));

            // let's clean up the placeholder chart
            ReactDOM.unmountComponentAtNode(el);
            el.remove();

            callback([ paths, texts, lines ]);
        }
    );
};

const groupData = (data) => {
    return Array.isArray(data[0]) ? data : data.map((value) => ([ value ]));
};

const Chart = ({ deferred, chartType, colorSchema, legendHeader, svgProps, chartWrapperProps, data, ...props }) => {
    const mappedData = [ 'lineChart', 'bar' ].includes(chartType) ? groupData(data) : data;
    const [ [ paths, texts, lines ], setChart ] = useState([]);
    const currChart = chartMapper[chartType] || chartMapper.pie;
    const colors = currChart.colorScale
        ? currChart.colorScale(getLightThemeColors(colorSchema).voronoi.colorScale)
        : getLightThemeColors(colorSchema).voronoi.colorScale;
    useEffect(() => {
        if (paths) {
            deferred.resolve();
        } else {
            getChartData({ ...currChart, chartType }, { ...props, data: mappedData }, chartWrapperProps, setChart);
        }
    }, [ paths ]);
    return <View style={[
        appliedStyles.flexRow,
        {
            paddingLeft: 30,
            paddinRight: 10,
            justifyContent: 'flex-start'
        }
    ]}>
        <Svg width={currChart.width * (props.legend ? 1 : 2)}
            height={currChart.height || currChart.width}
            {...svgProps}
        >
            <G transform={`translate(${
                currChart.translate?.x || 0}, ${currChart.translate?.y || 0
            }) scale(${
                (currChart.scale || 0.3) * (props.legend ? 1 : 2)
            })`}>
                {lines?.map((line, key) => (<Line {...line} key={key}/>))}
                {paths?.map((path, key) => <Path {...path} key={key} />)}
                {texts?.map(({ text, style, coords, textAnchor }, key) => (
                    <Text fontSize={style['font-size']?.replace('px', '')}
                        {...coords && {
                            x: coords?.[0],
                            y: coords?.[1]
                        }}
                        textAnchor={textAnchor}
                        key={key}
                        style={style}
                        fill={style.fill}
                    >
                        {text}
                    </Text>
                ))}
            </G>
        </Svg>
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
                        ...(Array.isArray(mappedData) ? mappedData : [ mappedData ]).map((data, key) => [
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
                                {data?.[0]?.name || data?.[0]?.x || data.name || data.x}
                            </Text>
                        ])
                    ]}
                />
        }
    </View>;
};

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
    chartType: PropTypes.string,
    svgProps: PropTypes.object,
    deferred: PropTypes.shape({
        resolve: PropTypes.func
    }),
    chartWrapperProps: PropTypes.object
};
Chart.defaultProps = {
    colorSchema: 'multiOrdered',
    legend: true,
    legendHeader: 'Legend'
};

const ChartWithContext = (props) => {
    const [ deferred ] = useState(new Deferred());
    const { setValue } = useContext(PDFContext);
    useEffect(() => {
        setValue(deferred);
    }, []);
    return <Chart {...props} deferred={deferred} />;
};

export default ChartWithContext;
