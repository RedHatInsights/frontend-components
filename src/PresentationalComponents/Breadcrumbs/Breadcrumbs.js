import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { AngleRightIcon } from '@patternfly/react-icons';

function upperCaseFirst(item)
{
    return item.charAt(0).toUpperCase() + item.slice(1);
}

const Breadcrumbs = ({ items, current, className, onNavigate, ...props }) => (
    <React.Fragment>
        {
            items.length > 0 && <ol { ...props } className={ classnames(className, 'ins-breadcrumbs') }>
                { items.map((oneLink, key) => (
                    <li key={ oneLink.navigate }>
                        <a key={ oneLink.navigate }
                            onClick={ event => onNavigate(event, oneLink.navigate, items.length - key) }>
                            { upperCaseFirst(oneLink.title) }
                        </a>
                        <AngleRightIcon />
                    </li>
                )) }

                { current &&
        <li className="ins-active">
            <span>{ upperCaseFirst(current) }</span>
        </li>
                }
            </ol>
        }
    </React.Fragment>
);

Breadcrumbs.propTypes = {
    items: PropTypes.arrayOf(PropTypes.any),
    current: PropTypes.string,
    onNavigate: PropTypes.func
};

Breadcrumbs.defaultProps = {
    items: [],
    current: null,
    onNavigate: Function.prototype
};

export default Breadcrumbs;
