import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { AngleRightIcon } from '@patternfly/react-icons';

const Breadcrumbs = ({ items, current, className, onNavigate, ...props }) => (
    <React.Fragment>
        {
            items.length > 0 && <ol { ...props } className={ classnames(className, 'ins-breadcrumbs') } widget-type='InsightsBreadcrumbs'>
                { items.map((oneLink, key) => (
                    <li key={ oneLink.navigate } data-key={ key }>
                        <a key={ oneLink.navigate }
                            onClick={ event => onNavigate(event, oneLink.navigate, key) }
                            aria-label={ oneLink.navigate }>
                            { oneLink.title }
                        </a>
                        <AngleRightIcon />
                    </li>
                )) }

                { current &&
                    <li className="ins-active">
                        <span>{ current }</span>
                    </li>
                }
            </ol>
        }
    </React.Fragment>
);

Breadcrumbs.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        navigate: PropTypes.any,
        title: PropTypes.node
    })),
    current: PropTypes.node,
    onNavigate: PropTypes.func
};

Breadcrumbs.defaultProps = {
    items: [],
    current: null,
    onNavigate: Function.prototype
};

export default Breadcrumbs;
