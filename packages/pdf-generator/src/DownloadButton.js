import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { PDFViewer, usePDF } from '@react-pdf/renderer';
import { Button } from '@patternfly/react-core';
import PDFDocument from './components/PDFDocument';
import { Fragment } from 'react';
import debounce from 'lodash/debounce';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';

const downloadBlob = (instance, fileName, onLoading, onError, onSuccess) => {
    if (instance.blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(instance.blob);
        link.download = fileName;
        document.body.append(link);
        link.click();
        link.remove();

        onSuccess();
    }

    instance.loading && onLoading();
    instance.error && onError();
};

const DownloadButtonWrapper = ({
    fileName,
    label,
    isPreview,
    asyncFunction,
    buttonProps,
    showButton,
    onSuccess,
    onLoading,
    onError,
    pages,
    ...props
}) => {
    const [ contextValue, setContextValue ] = useState([]);
    const [ asyncPages, setAsyncPages ] = useState([]);
    const [ shouldDownload, setShouldDownload ] = useState(false);
    // eslint-disable-next-line react/display-name
    const [ instance, updateInstance ] = usePDF({
        document: <PDFDocument
            {...props}
            pages={asyncPages.length > 0 ? asyncPages : pages}
            contextValue={contextValue}
            setContextValue={(newPromise) => setContextValue((val) => [
                ...val || [],
                newPromise
            ])}
        />
    });
    const debounced = useCallback(debounce((currInstance) => {
        downloadBlob(currInstance, fileName, onLoading, onError, onSuccess);
    }, 100), [ asyncPages.length > 0 ? asyncPages.length : pages?.length ]);
    const updateAsyncPages = (callback) => {
        if (asyncFunction) {
            Promise.resolve(asyncFunction()).then(asyncPages => {
                setAsyncPages(asyncPages);
                updateInstance();
                callback?.();
            });
        }
    };

    useEffect(() => {
        updateInstance();
        if (asyncPages.length === 0 && !showButton) {
            updateAsyncPages(() => setShouldDownload(true));
        }

        Promise.all(contextValue).then(() => {
            updateInstance();
        });
    }, [ asyncPages, contextValue ]);

    useEffect(() => {
        if (!instance.loading && shouldDownload) {
            debounced(instance);
        }
    }, [ instance.loading, instance?.blob?.size, shouldDownload ]);
    const downloadButton = <Button
        onClick={() => {
            if (asyncFunction) {
                updateAsyncPages(() => setShouldDownload(true));
            } else {
                setShouldDownload(true);
            }
        }}
        { ...buttonProps }
    >
        {label}
    </Button>;
    return (
        <React.Fragment>
            { isPreview
                ? <PDFViewer src={instance.url}/>
                : asyncFunction && (showButton ? downloadButton : <Fragment />) || downloadButton
            }
        </React.Fragment>
    );
};

DownloadButtonWrapper.propTypes = {
    ...PDFDocument.propTypes,
    fileName: PropTypes.string,
    isPreview: PropTypes.bool,
    label: PropTypes.node,
    asyncFunction: PropTypes.func,
    showButton: PropTypes.bool,
    onSuccess: PropTypes.func,
    onLoading: PropTypes.func,
    onError: PropTypes.func
};

DownloadButtonWrapper.defaultProps = {
    ...PDFDocument.defaultProps,
    fileName: '',
    label: 'Download PDF',
    isPreview: false,
    showButton: true,
    onSuccess: () => undefined,
    onError: () => undefined,
    onLoading: () => undefined
};

const DownloadButton = (props) => (<AsyncComponent
    appName="chrome"
    module="./DownloadButton"
    ErrorComponent={<DownloadButtonWrapper {...props} />}
    {...props}
/>);

export { DownloadButtonWrapper };

export { DownloadButton };

export default DownloadButton;
