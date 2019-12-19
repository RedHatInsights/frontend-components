import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@react-pdf/renderer';
import { styleProps } from '../utils/propTypes';

const Table = ({
    rows,
    withHeader,
    headerStyles,
    rowsStyle,
    style,
    ...props
}) => {
    const [ header, ...cells ] = rows;
    console.log(cells);
    return <View { ...props } style={{
        display: 'flex',
        flexDirection: 'column',
        ...style
    }}>
        {
            withHeader && <View style={{
                display: 'flex',
                flexDirection: 'row',
                ...headerStyles
            }}>
                {header.map((cell, key) => <Text key={ key } style={{
                    fontWeight: 700,
                    fontSize: 9,
                    color: '#4f4c4d',
                    flex: 1
                }}>
                    {cell}
                </Text>)}
            </View>
        }
        <View style={{
            borderTopStyle: 'solid',
            borderTopColor: '#4f4c4d',
            borderTopWidth: 1,
            borderBottomStyle: 'solid',
            borderBottomColor: '#4f4c4d',
            borderBottomWidth: 1
        }}>
            {
                (!withHeader ? [ header, ...cells ] : cells).map((row, key) => (
                    <View key={key} style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        ...key % 2 && { backgroundColor: '#ededed' },
                        ...rowsStyle
                    }}>
                        { row.map((cell, cellKey) => (
                            (typeof cell === 'string' || cell instanceof String) ? <Text key={cellKey} style={{
                                fontSize: 9,
                                color: '#151515',
                                flex: 1
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

Table.propTypes = {
    style: styleProps,
    rowsStyle: styleProps,
    withHeader: PropTypes.bool,
    rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)),
    headerStyles: styleProps
};

Table.defaultProps = {
    style: {},
    headerStyles: {},
    rowsStyle: {}
};

export default Table;
