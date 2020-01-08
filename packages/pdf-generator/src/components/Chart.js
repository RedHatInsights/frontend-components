import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { CircleIconConfig } from '@patternfly/react-icons';
import { View, Canvas, Text } from '@react-pdf/renderer';
import { ChartPie, ChartDonut, ChartDonutUtilization, getLightThemeColors } from '@patternfly/react-charts';
import Table from './Table';
import styles from '../utils/styles';

const appliedStyles = styles();

const chartMapper = {
    pie: {
        component: ChartPie,
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
            <Chart data={ data } { ...props } />,
            el,
        );

        const paths = Array.from(el.querySelectorAll('path')).map((path) => path.getAttribute('d'));
        // let's clean up the placeholder chart
        ReactDOM.unmountComponentAtNode(el);
        el.remove();

        return paths;
    }

    render() {
        const { data, chartType, colorSchema, ...props } = this.props;
        const currChart = chartMapper[chartType] || chartMapper.pie;

        const colors = currChart.colorScale ?
            currChart.colorScale(getLightThemeColors(colorSchema).voronoi.colorScale) :
            getLightThemeColors(colorSchema).voronoi.colorScale;
        const paths = this.getChartData(currChart);

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
                paint={({ path }) => paths.map((onePath, key) => path(onePath).scale(key === 0 ? 0.34 : 1)
                .translate(key === 0 ? 100 : 0, key === 0 ? 100 : 0).fill(colors[key]))
                }
            />
            <Table
                withHeader
                style={
                    { width: 'auto', flex: 1 }
                }
                rowsStyle={{
                    justifyContent: 'flex-start'
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
                            paint={({ path }) => path(CircleIconConfig.svgPath).scale(0.012).fill(colors[key])}
                        />,
                        <Text key={`${key}-text`}>
                            {x} {y}
                        </Text>
                    ])
                ]}
            />
        </View>;
    }
}

Chart.propTypes = {};
Chart.defaultProps = {
    colorSchema: 'multi-ordered'
};

// voronoi
// 'multi-ordered'

export default Chart;
