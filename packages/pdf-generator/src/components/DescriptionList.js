/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@react-pdf/renderer';
import { styleProps } from '../utils/propTypes';
import styles from '../utils/styles';

const appliedStyles = styles();

const DescriptionList = ({
    rows,
    rowsStyle,
    style,
    ...props
}) => {
    return <View { ...props } style={{
        display: 'flex',
        flexDirection: 'column',
        ...style
    }}>
        <View>
            {
                rows.map((row, key) => (
                    <View key={key} style={{
                        display: 'flex',
                        flexDirection: 'row',
                        ...rowsStyle
                    }}>
                        { row.map((cell, cellKey) => (
                            (typeof cell === 'string' || cell instanceof String) ? <Text key={cellKey} style={{
                                ...appliedStyles.text,
                                ...appliedStyles.dt,
                                ...cellKey % 2 && { ...appliedStyles.dd }
                            }}>
                                { cell }
                            </Text> : cell
                        )) }
                    </View>
                ))
            }
        </View>
    </View>;
};

DescriptionList.propTypes = {
    style: styleProps,
    rowsStyle: styleProps,
    rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node))
};

DescriptionList.defaultProps = {
    style: {},
    rowsStyle: {}
};

export default DescriptionList;
