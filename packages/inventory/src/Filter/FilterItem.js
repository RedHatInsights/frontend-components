import React, { Fragment } from 'react';
import { DropdownItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';

const FilterItem = ({ filter, pad = 0, isDisabled, onClick, ...props }) => (
    <DropdownItem
        { ...props }
        data-value={ filter.value }
        isDisabled={ isDisabled }
        component="button"
        onClick={ onClick }
        className={ `ins-inventory-filter-${pad}` }
    >
        {
            !isDisabled &&
            <Fragment>
                <input
                    type="checkbox"
                    name={ `filter-${filter.value}` }
                    className="pf-c-check__input"
                    checked={ !!filter.selected || false }
                    onChange={ _event => undefined }
                />
                <label className="pf-c-check__label" htmlFor={ `filter-${filter.value}` }>{ filter.title }</label>
            </Fragment>
        }
        { isDisabled && filter.title }
    </DropdownItem>
);

FilterItem.propTypes = {};
FilterItem.defaultProps = {};

export default FilterItem;
