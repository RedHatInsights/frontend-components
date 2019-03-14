import React, { createContext, Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import routerParams from '../../Utilities/RouterParams';
import InventoryList from './InventoryList';
import InventoryDetail from './InventoryDetail';
import Pagination from './Pagination';
import { updateEntities } from '../../redux/actions/inventory';
import AppInfo from './AppInfo';
import { VulnerabilitiesStore } from '../../redux/reducers/inventory/vulnerabilities';
import { Level, LevelItem } from '@patternfly/react-core';
import EntityTableToolbar from './EntityTableToolbar';

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
                    totalItems={ total || (items && items.length) }
                    hasItems={ Boolean(items) }
                    filters={ filters }
                    pathPrefix={ pathPrefix }
                    apiBase={ apiBase }
                    page={ page }
                    onRefresh={ onRefresh }
                    perPage={ perPage }
                >
                    <Level>
                        <LevelItem>
                            { children }
                        </LevelItem>
                        <LevelItem>
                            <Pagination
                                totalItems={ total || (items && items.length) }
                                page={ page }
                                onRefresh={ onRefresh }
                                perPage={ perPage }
                            />
                        </LevelItem>
                    </Level>
                </EntityTableToolbar>
                <InventoryList
                    { ...props }
                    onRefresh={ onRefresh }
                    items={ items }
                    pathPrefix={ pathPrefix }
                    apiBase={ apiBase }
                    perPage={ perPage }
                    showHealth={ showHealth }
                />
            </InventoryContext.Provider>
        );
    }
}

const InventoryItem = ({ root, pathPrefix = 0, apiBase, useCard = false, hideBack = false, ...props }) => (
    <InventoryDetail
        { ...props }
        root={ root }
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

export function inventoryConnector() {
    const InventoryDetail = (props) => (
        <Fragment>
            <InventoryItem { ...props } />
            <AppInfo />
        </Fragment>
    );

    const connectedInventory = routerParams((Inventory));

    connectedInventory.updateEntities = updateEntities;
    connectedInventory.InventoryTable = InventoryTable;
    connectedInventory.AppInfo = AppInfo;
    connectedInventory.InventoryDetailHead = InventoryItem;
    connectedInventory.InventoryDetail = InventoryDetail;
    connectedInventory.VulnerabilitiesStore = VulnerabilitiesStore;

    return connectedInventory;
}
