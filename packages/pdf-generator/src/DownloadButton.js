import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { PDFViewer, usePDF } from '@react-pdf/renderer';
import { Button } from '@patternfly/react-core';
import PDFDocument from './components/PDFDocument';
import { Fragment } from 'react';
import debounce from 'lodash/debounce';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';

const downloadBlob = (instance, fileName, onLoading, onError, onSuccess) => {
    console.log(onSuccess, instance.blob, 'is this defined? onSuccess');
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
    console.log(asyncFunction ? asyncPages : pages || [], 'this is pages!');
    // eslint-disable-next-line react/display-name
    // const [ instance, updateInstance ] = usePDF({
    //     document: <PDFDocument
    //         // {...props}
    //         pages={asyncFunction ? asyncPages : pages || []}
    //         contextValue={contextValue}
    //         setContextValue={(newPromise) => setContextValue((val) => [
    //             ...val || [],
    //             newPromise
    //         ])}
    //     />
    // });
    // const debounced = useCallback(debounce((currInstance) => {
    //     downloadBlob(currInstance, fileName, onLoading, onError, onSuccess);
    // }, 100), [ asyncFunction ? asyncPages.length : pages?.length ]);
    const updateAsyncPages = (callback) => {
        if (asyncFunction) {
            Promise.resolve(asyncFunction()).then(asyncPages => {
                setAsyncPages(asyncPages);
                // updateInstance();
                callback?.();
            });
        }
    };

    // useEffect(() => {
    //     updateInstance();
    //     if (asyncPages.length === 0 && !showButton) {
    //         updateAsyncPages(() => setShouldDownload(true));
    //     }

    //     Promise.all(contextValue).then(() => {
    //         updateInstance();
    //     });
    // }, [ asyncPages, contextValue ]);

    // useEffect(() => {
    //     console.log('am I here?', instance);
    //     if (!instance.loading && shouldDownload) {
    //         debounced(instance);
    //     }
    // }, [ instance.loading, instance?.blob?.size, shouldDownload ]);
    console.log('instance!');
    const downloadButton = <Button
        onClick={() => updateAsyncPages(() => setShouldDownload(true))}
        { ...buttonProps }
    >
        {label}
    </Button>;
    return (
        <React.Fragment>
            {/* { isPreview
                ? <PDFViewer src={instance.url}/>
                : asyncFunction && (showButton ? downloadButton : <Fragment />) || downloadButton
            } */}
            aaaaa
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
