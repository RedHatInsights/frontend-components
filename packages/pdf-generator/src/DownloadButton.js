import React from 'react';
import PropTypes from 'prop-types';
import { PDFDownloadLink, PDFViewer, BlobProvider } from '@react-pdf/renderer';
import { Button } from '@patternfly/react-core';
import PDFDocument from './components/PDFDocument';

class DownloadButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            asyncPages: []
        };
    }

    updateAsyncPages() {
        const { asyncFunction } = this.props;

        if (asyncFunction) {
            this.setState({
                asyncPages: []
            }, () => {
                Promise.resolve(asyncFunction()).then(asyncPages => this.setState({
                    asyncPages
                }));
            });
        }
    }

    componentDidMount() {
        const { showButton } = this.props;

        if (!showButton) {
            this.updateAsyncPages();
        }
    }

    render() {
        const {
            fileName,
            label,
            isPreview,
            asyncFunction,
            buttonProps,
            showButton,
            ...props
        } = this.props;

        return (
            <React.Fragment>
                { isPreview
                    ? <PDFViewer>
                        <PDFDocument { ...props } />
                    </PDFViewer>
                    : asyncFunction
                        ? <React.Fragment>
                            { showButton && <Button onClick={this.updateAsyncPages} { ...buttonProps }>{label}</Button> }
                            {this.state.asyncPages.length > 0 && (
                                <BlobProvider document={<PDFDocument { ...props } pages={this.state.asyncPages} />}>
                                    {({ blob }) => {
                                        if (blob) {
                                            const link = document.createElement('a');
                                            link.href = URL.createObjectURL(blob);
                                            link.download = fileName;
                                            document.body.append(link);
                                            link.click();
                                            link.remove();
                                            this.setState({
                                                asyncPages: []
                                            });
                                        }

                                        return <React.Fragment />;
                                    }}
                                </BlobProvider>
                            )}
                        </React.Fragment>
                        : <PDFDownloadLink
                            document={<PDFDocument { ...props } />}
                            fileName={fileName}
                            {...props}
                        >
                            {label}
                        </PDFDownloadLink>
                }
            </React.Fragment>
        );
    }
}

DownloadButton.propTypes = {
    ...PDFDocument.propTypes,
    fileName: PropTypes.string,
    isPreview: PropTypes.bool,
    label: PropTypes.node,
    asyncFunction: PropTypes.func,
    showButton: PropTypes.bool
};

DownloadButton.defaultProps = {
    ...PDFDocument.defaultProps,
    fileName: '',
    label: 'Download PDF',
    isPreview: false,
    showButton: true
};

export default DownloadButton;
