import React from 'react';
import PropTypes from 'prop-types';
import {
    Page,
    Text,
    View,
    Document
} from '@react-pdf/renderer';
import RHLogo from './Logo';
// eslint-disable-next-line rulesdir/disallow-fec-relative-imports
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { customTitle } from '../utils/text';
import styles from '../utils/styles';

const PDFDocument = ({
    pages,
    type,
    style,
    title,
    reportName,
    groupName,
    size,
    orientation,
    allPagesHaveTitle,
    footer,
    ...props
}) => {
    const appliedStyles = styles(style);

    return <Document style={{
        height: '100%'
    }}>
        {pages.map((page, key) => (
            <Page size={size} orientation={orientation} key={key} style={[ appliedStyles.page, appliedStyles.text ]}>
                {<React.Fragment>
                    <View style={appliedStyles.headerContainer}>
                        <RHLogo />
                        <Text style={appliedStyles.currDate}>
                            Prepared {DateFormat({ date: new Date(), type: 'exact' }).props.children}
                        </Text>
                    </View>
                    <View style={appliedStyles.reportNameWrapper}>

                        {(allPagesHaveTitle || key === 0) && (
                            <React.Fragment>
                                <Text style={ appliedStyles.groupName }>
                                    {groupName}
                                </Text>
                                <Text style={[ appliedStyles.reportName, appliedStyles.displayFont ]}>
                                    {reportName} {type}
                                </Text>
                            </React.Fragment>
                        )}
                    </View>
                    <View>
                        <Text style={ appliedStyles.displayFont }>
                            { customTitle(title) }
                        </Text>
                    </View>
                </React.Fragment>}
                <View style={appliedStyles.smallSpacing}>
                    {page}
                </View>
                <View style={[{
                    marginTop: 'auto'
                }]}>
                    {footer}
                    <View style={[ appliedStyles.flexRow ]}>
                        <Text style={[{
                            marginLeft: 'auto'
                        }]}>
                            { key + 1 } of {pages.length}
                        </Text>
                        <Text style={[{
                            marginLeft: 'auto'
                        }, appliedStyles.thirdTitle ]}>
                            redhat.com
                        </Text>
                    </View>
                </View>
            </Page>
        ))}
    </Document>;
};

PDFDocument.propTypes = {
    pages: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
    ])),
    size: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.number
    ]),
    orientation: PropTypes.string,
    reportName: PropTypes.string,
    type: PropTypes.string,
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                title: PropTypes.string,
                fontWeight: PropTypes.number,
                style: PropTypes.shape({
                    [PropTypes.string]: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ])
                })
            })
        ]))
    ]),
    style: PropTypes.shape({
        [PropTypes.string]: PropTypes.any
    }),
    allPagesHaveTitle: PropTypes.bool,
    footer: PropTypes.node,
    groupName: PropTypes.string
};
PDFDocument.defaultProps = {
    size: 'A4',
    reportName: 'Executive report:',
    pages: [],
    title: '',
    type: 'Default',
    allPagesHaveTitle: true
};

export default PDFDocument;
