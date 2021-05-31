/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React from 'react';

/**
 * Helper function to proprly calculate what to do when user clicks on first cell.
 * Either full redirect if used with ctrl button or `onRowClick` from props is used.
 * @param {*} event html event, to find out if meta key was clicked.
 * @param {*} key inventory UUID.
 * @param {*} props additional props from `EntityTable` - loaded, onRowClick and noDetail.
 */
const onRowClick = (event, key, { loaded, onRowClick: rowClick, noDetail }) => {
    if (loaded && !noDetail) {
        const isMetaKey = (event.ctrlKey || event.metaKey || event.which === 2);
        if (isMetaKey) {
            const url = new URL(`./${key}`, location.href);
            window.open(url.href);
        } else if (rowClick) {
            rowClick(event, key, isMetaKey);
        }
    }
};

/**
 * Helper function to generate first cell in plain inventory either with clickable detail or just data from attribut.
 * This is later on used in redux in `renderFunc`.
 * @param {React.node} data React node with information that will be shown to user as column title.
 * @param {string} id inventory UUID, used to navigate to correct URL.
 * @param {*} item row data, holds every information from redux store for currecnt row.
 * @param {*} props additional props passed from `EntityTable` - holds any props passed to inventory table.
 */
const TitleColumn = (data, id, item, props) => (
    <div className="ins-composed-col">
        <div key="os_release">{item?.os_release}</div>
        <div key="data" className={props?.noDetail ? 'ins-m-nodetail' : ''}>
            { props?.noDetail ?
                data :
                <a
                    widget="col"
                    href={ `${location.pathname}${location.pathname.substr(-1) === '/' ? '' : '/'}${id}` }
                    onClick={ event => {
                        event.preventDefault();
                        event.stopPropagation();
                        onRowClick(event, id, props);
                    }}
                >
                    { data }
                </a> }
        </div>
    </div>
);

export default TitleColumn;
