import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import {
    Page,
    Text,
    View,
    Document,
    PDFViewer
} from '@react-pdf/renderer';
import RHLogo from './components/Logo';
import { DateFormat } from '../../components/src/Components/DateFormat';
import { customTitle } from './utils/text';
import styles from './utils/styles';

class DownloadButton extends React.Component {
    render() {
        const {
            pages,
            fileName,
            label,
            type,
            style,
            title,
            preview,
            reportName,
            ...props
        } = this.props;
        const appliedStyles = styles(style);

        const document = <Document style={{
            height: '100%'
        }}>
            {pages.map((page, key) => (
                <Page key={key} style={[ appliedStyles.page, appliedStyles.text ]}>
                    {<React.Fragment>
                        <View style={appliedStyles.headerContainer}>
                            <RHLogo />
                            <Text style={appliedStyles.currDate}>
                                Prepared {DateFormat({ date: new Date(), type: 'exact' }).props.children}
                            </Text>
                        </View>
                        <View>
                            <Text style={[ appliedStyles.reportName, appliedStyles.largeSpacing ]}>
                                {reportName} {type}
                            </Text>
                        </View>
                        <View>
                            <Text>
                                { customTitle(title) }
                            </Text>

                        </View>
                    </React.Fragment>}
                    <View style={appliedStyles.smallSpacing}>
                        {page}
                    </View>
                    <View style={[ appliedStyles.flexRow, {
                        marginTop: 'auto'
                    }]}>
                        <Text style={[{
                            marginLeft: 'auto'
                        }, appliedStyles.thirdTitle ]}>
                            redhat.com
                        </Text>
                    </View>
                </Page>
            ))}
        </Document>;

        return (
            <React.Fragment>
                { preview ? <PDFViewer>
                    {document}
                </PDFViewer> : <PDFDownloadLink
                    document={document}
                    fileName={fileName}
                    {...props}
                >
                    {label}
                </PDFDownloadLink> }
            </React.Fragment>
        );
    }
}

DownloadButton.propTypes = {
    pages: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
    ])),
    reportName: PropTypes.string,
    fileName: PropTypes.string,
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
    preview: PropTypes.bool,
    label: PropTypes.node
};

DownloadButton.defaultProps = {
    reportName: 'Executive report:',
    pages: [],
    title: '',
    type: 'Default',
    fileName: '',
    label: 'Download PDF',
    preview: false
};

export default DownloadButton;
