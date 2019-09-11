import React, { Component, Fragment } from 'react';
import { DataToolbar, DataToolbarItem, DataToolbarContent } from '@patternfly/react-core/dist/esm/experimental';
import { Pagination } from '@patternfly/react-core';
import { ConditionalFilter } from '../ConditionalFilter';
import { BulkSelect } from '../BulkSelect';
import Actions from './Actions';
import PropTypes from 'prop-types';

class PrimaryToolbar extends Component {
    render () {
        const {
            id,
            className,
            toggleIsExpanded,
            bulkSelect,
            filterConfig,
            actions,
            exportsConfig,
            sortByConfig,
            pagination,
            filters,
            children,
            ...props
        } = this.props;
        return (
            <DataToolbar
                { ...props }
                className={ `${className || ''} ins-c-primary-toolbar` }
                toggleIsExpanded={ toggleIsExpanded }
                id={ id || 'ins-primary-data-toolbar' }
            >
                <DataToolbarContent>
                    {
                        bulkSelect &&
                        <DataToolbarItem>
                            <BulkSelect { ...bulkSelect }/>
                        </DataToolbarItem>
                    }
                    {
                        filterConfig &&
                        <DataToolbarItem>
                            <BulkSelect { ...filterConfig } />
                        </DataToolbarItem>
                    }
                    {
                        (actions && actions.length > 0) &&
                        <Actions actions={ actions } />
                    }
                    {
                        sortByConfig &&
                        <DataToolbarItem>

                        </DataToolbarItem>
                    }
                    { children }
                    { pagination && <DataToolbarItem>Bla</DataToolbarItem> }
                </DataToolbarContent>
                {
                    filters &&
                    <DataToolbarContent>
                        <DataToolbarItem>Filters</DataToolbarItem>
                    </DataToolbarContent>
                }
            </DataToolbar>
        );
    }
}

PrimaryToolbar.propTypes = {
    id: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    className: PropTypes.string,
    toggleIsExpanded: PropTypes.func,
    bulkSelect: PropTypes.shape(BulkSelect.propTypes),
    filterConfig: PropTypes.shape(ConditionalFilter.propTypes),
    children: PropTypes.node,
    actions: Actions.propTypes.actions
};

PrimaryToolbar.defaultProps = {
    toggleIsExpanded: () => undefined
};

export default PrimaryToolbar;
