/* eslint-disable react/prop-types */
import React from 'react';

const onRowClick = (event, key, { loaded, onRowClick }) => {
    if (loaded && onRowClick) {
        const isMetaKey = (event.ctrlKey || event.metaKey || event.which === 2);
        if (isMetaKey) {
            const url = new URL(`./${key}`, location.href);
            window.open(url.href);
        } else {
            onRowClick(event, key, isMetaKey);
        }
    }
};

const TitleColumn = (data, id, item, props) => {
    return (
        <div className="ins-composed-col">
            <div>{item.os_release}</div>
            { props.onRowClick ?
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
                </a> :
                <div>
                    {data}
                </div>
            }
        </div>
    );
};

export default TitleColumn;
