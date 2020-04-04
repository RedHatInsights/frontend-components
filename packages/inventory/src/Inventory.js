import React, { createContext, Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import { TableToolbar } from '@redhat-cloud-services/frontend-components';
import InventoryList from './InventoryList';
import InventoryDetail from './InventoryDetail';
import Pagination from './Pagination';
import { updateEntities } from './redux/actions';
import AppInfo from './AppInfo';
import EntityTableToolbar from './EntityTableToolbar';
import { Provider } from 'react-redux';
import TagWithDialog from './TagWithDialog';
export const InventoryContext = createContext('inventory');

class InventoryTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onRefreshData: () => undefined,
            onUpdateData: () => undefined
        };
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

const InventoryItem = ({ pathPrefix = 0, apiBase, useCard = false, hideBack = false, ...props }) => (
    <InventoryDetail
        { ...props }
        pathPrefix={ pathPrefix }
        apiBase={ apiBase }
        useCard={ useCard }
        hideBack={ hideBack }
    />
);

const Inventory = ({ match = {}, noTable = false, items, pathPrefix = 0, apiBase }) => {
    return (
        <Switch>
            {
                !noTable &&
                <Route exact path={ match.url } render={ props => (
                    <InventoryTable { ...props } items={ items } pathPrefix={ pathPrefix } apiBase={ apiBase } />
                ) } />
            }
            <Route path={ `${match.url}${match.url.substr(-1, 1) === '/' ? '' : '/'}:inventoryId` }
                render={ props => (
                    <Fragment>
                        <InventoryItem { ...props } root={ match.url } pathPrefix={ pathPrefix } apiBase={ apiBase } />
                        <AppInfo />
                    </Fragment>
                ) }
            />
        </Switch>
    );
};

export default routerParams((Inventory));

const reduxComponent = (props, store, ConnectedComponent) => <Fragment>
    {
        store ? <Provider store={store}>
            <ConnectedComponent {...props} />
        </Provider> :
            <ConnectedComponent {...props} />
    }
</Fragment>;

export function inventoryConnector(store) {
    const InventoryDetail = (props) => (
        <Fragment>
            <InventoryItem { ...props } />
            <AppInfo />
        </Fragment>
    );

    const connectedInventory = routerParams((Inventory));

    connectedInventory.updateEntities = updateEntities;
    connectedInventory.InventoryTable = React.forwardRef((props, ref) => reduxComponent({ ...props, ref }, store, InventoryTable));
    connectedInventory.AppInfo = React.forwardRef((props, ref) => reduxComponent({ ...props, ref }, store, AppInfo));
    connectedInventory.InventoryDetailHead = React.forwardRef((props, ref) => reduxComponent({ ...props, ref }, store, InventoryItem));
    connectedInventory.InventoryDetail = React.forwardRef((props, ref) => reduxComponent({ ...props, ref }, store, InventoryDetail));
    connectedInventory.TagWithDialog = React.forwardRef((props, ref) => reduxComponent({ ...props, ref }, store, TagWithDialog));
    return connectedInventory;
}
