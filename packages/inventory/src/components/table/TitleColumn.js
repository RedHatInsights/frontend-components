/* eslint-disable react/prop-types */
import React from 'react';

const onRowClick = (event, key, { loaded, onRowClick, noDetail }) => {
    if (loaded && !noDetail) {
        const isMetaKey = (event.ctrlKey || event.metaKey || event.which === 2);
        if (isMetaKey) {
            const url = new URL(`./${key}`, location.href);
            window.open(url.href);
        } else if (onRowClick) {
            onRowClick(event, key, isMetaKey);
        }
    }
};

const TitleColumn = (data, id, item, props) => {
    return (
        <div className="ins-composed-col">
            <div>{item.os_release}</div>
            { !props.noDetail ?
                <div>
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
                    </a>
                </div> :
                <div>
                    {data}
                </div>
            }
        </div>
    );
};

export default TitleColumn;
