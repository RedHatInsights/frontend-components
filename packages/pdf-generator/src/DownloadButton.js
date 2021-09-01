import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { PDFViewer, usePDF } from '@react-pdf/renderer';
import { Button } from '@patternfly/react-core';
import PDFDocument from './components/PDFDocument';
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
    const updateAsyncPages = (callback) => {
        if (asyncFunction) {
            Promise.resolve(asyncFunction()).then(asyncPages => {
                setAsyncPages(asyncPages);
                callback?.();
            });
        }
    };

    useEffect(() => {
        updateInstance();
        if (asyncPages.length === 0 && !props.showButton) {
            updateAsyncPages(downloadBlob(instance, fileName, onLoading, onError));
        }

        Promise.all(contextValue).then(() => {
            updateInstance();
        });
    }, [ asyncPages, contextValue ]);
    const downloadButton = <Button onClick={() => updateAsyncPages(() => {
        downloadBlob(instance, fileName, onLoading, onError);
    })} { ...buttonProps }>{label}</Button>;
    return (
        <React.Fragment>
            { isPreview
                ? <PDFViewer src={instance.url}/>
                : (asyncFunction && showButton) ? downloadButton
                    : downloadButton
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

const DownloadButton = (props) => (
    <AsyncComponent
        appName="chrome"
        module="./DownloadButton"
        {...props}
    />
);

export { DownloadButtonWrapper };

export default DownloadButton;
