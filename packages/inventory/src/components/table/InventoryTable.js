import React, { Component } from 'react';
import { InventoryContext } from '../../shared';
import EntityTableToolbar from './EntityTableToolbar';
import { TableToolbar } from '@redhat-cloud-services/frontend-components/components/esm/TableToolbar';
import InventoryList from './InventoryList';
import Pagination from './Pagination';

class InventoryTable extends Component {
    state = {
        onRefreshData: () => undefined,
        onUpdateData: () => undefined
    }

    onRefreshData = (options) => {
        const { onUpdateData } = this.state;
        onUpdateData(options);
    }

    render() {
        const {
            items,
            pathPrefix = 0,
            filters,
            apiBase,
            showHealth,
            onRefresh,
            page,
            perPage,
            total,
            children,
            showTags,
            ...props
        } = this.props;
        return (
            <InventoryContext.Provider value={ {
                onRefreshData: this.state.onRefreshData,
                onUpdateData: this.state.onUpdateData,
                setRefresh: (onRefreshData) => this.setState({
                    onRefreshData
                }),
                setUpdate: (onUpdateData) => this.setState({
                    onUpdateData
                })
            } }>
                <EntityTableToolbar
                    { ...props }
                    onRefresh={onRefresh}
                    totalItems={ total || (items && items.length) }
                    hasItems={ Boolean(items) }
                    filters={ filters }
                    pathPrefix={ pathPrefix }
                    apiBase={ apiBase }
                    page={ page }
                    perPage={ perPage }
                    showTags={ showTags }
                >
                    { children }
                </EntityTableToolbar>
                <InventoryList
                    { ...props }
                    hasItems={ Boolean(items) }
                    onRefresh={ onRefresh }
                    items={ items }
                    pathPrefix={ pathPrefix }
                    apiBase={ apiBase }
                    perPage={ perPage }
                    showHealth={ showHealth }
                    showTags={ showTags }
                />
                <TableToolbar isFooter className="ins-c-inventory__table--toolbar">
                    <Pagination
                        isFull
                        totalItems={ total || (items && items.length) }
                        page={ page }
                        hasItems={ Boolean(items) }
                        onRefresh={ onRefresh }
                        perPage={ perPage }
                    />
                </TableToolbar>
            </InventoryContext.Provider>
        );
    }
}

export default InventoryTable;
