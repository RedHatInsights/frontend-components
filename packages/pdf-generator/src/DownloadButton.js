import React from 'react';
import PropTypes from 'prop-types';
import { BlobProvider, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { Button } from '@patternfly/react-core';
import PDFDocument from './components/PDFDocument';
// eslint-disable-next-line rulesdir/disallow-fec-relative-imports
import { AsyncComponent } from '@redhat-cloud-services/frontend-components';

class DownloadButtonWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      asyncPages: [],
    };
  }

  updateAsyncPages = () => {
    const { asyncFunction } = this.props;
    if (asyncFunction) {
      this.setState(
        {
          asyncPages: [],
        },
        () => {
          Promise.resolve(asyncFunction()).then((asyncPages) =>
            this.setState({
              asyncPages,
            })
          );
        }
      );
    }
  };

  componentDidMount() {
    const { showButton } = this.props;

    if (!showButton) {
      this.updateAsyncPages();
    }
  }

  render() {
    const { fileName, label, isPreview, asyncFunction, buttonProps, showButton, onSuccess, onLoading, onError, ...props } = this.props;

    return (
      <React.Fragment>
        {isPreview ? (
          <PDFViewer>
            <PDFDocument {...props} />
          </PDFViewer>
        ) : asyncFunction ? (
          <React.Fragment>
            {showButton && (
              <Button onClick={this.updateAsyncPages} {...buttonProps}>
                {label}
              </Button>
            )}
            {this.state.asyncPages.length > 0 && (
              <BlobProvider document={<PDFDocument {...props} pages={this.state.asyncPages} />}>
                {({ blob, loading, error }) => {
                  if (blob) {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = fileName;
                    document.body.append(link);
                    link.click();
                    link.remove();
                    this.setState({
                      asyncPages: [],
                    });

                    onSuccess();
                  }

                  loading && onLoading();
                  error && onError();

                  return <React.Fragment />;
                }}
              </BlobProvider>
            )}
          </React.Fragment>
        ) : (
          <PDFDownloadLink document={<PDFDocument {...props} />} fileName={fileName} {...props}>
            {label}
          </PDFDownloadLink>
        )}
      </React.Fragment>
    );
  }
}

DownloadButtonWrapper.propTypes = {
  ...PDFDocument.propTypes,
  fileName: PropTypes.string,
  isPreview: PropTypes.bool,
  label: PropTypes.node,
  asyncFunction: PropTypes.func,
  showButton: PropTypes.bool,
  onSuccess: PropTypes.func,
  onLoading: PropTypes.func,
  onError: PropTypes.func,
};

DownloadButtonWrapper.defaultProps = {
  ...PDFDocument.defaultProps,
  fileName: '',
  label: 'Download PDF',
  isPreview: false,
  showButton: true,
  onSuccess: () => undefined,
  onError: () => undefined,
  onLoading: () => undefined,
};

const DownloadButton = (props) => <AsyncComponent appName="chrome" module="./DownloadButton" {...props} />;

export { DownloadButtonWrapper };

export default DownloadButton;
