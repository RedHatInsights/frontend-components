# Inventory detail
If you want to learn how to comunicate with inventory check out [Inventory](doc/components/inventory/inventory.md), this documentation is for showing how to include inventory information at top and app info in bottom screen of inventory detail.

### Usage
1) Import correct components

Since we are going to use different layout than the one automatically provided you need to import `InventoryDetailHead` for basic information and `AppInfo` for application detail.

```JSX
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './inventory.scss';
import { PageHeader, Main, routerParams, Breadcrumbs } from '@red-hat-insights/insights-frontend-components';
import { entitesDetailReducer } from '../store';
import * as actions from '../actions';
import { Grid, GridItem } from '@patternfly/react-core';
import { asyncInventoryLoader } from '../components/inventory/AsyncInventory';
import { registry as registryDecorator } from '@red-hat-insights/insights-frontend-components';

@registryDecorator()
class Inventory extends Component {

    constructor(props, ctx) {
        super(props, ctx);
        this.loadInventory();

        this.state = {};
        this.onNavigate = this.onNavigate.bind(this);
    }

    async loadInventory() {
        const {
            inventoryConnector,
            INVENTORY_ACTION_TYPES,
            mergeWithDetail
        } = await asyncInventoryLoader();
        this.getRegistry().register({
            ...mergeWithDetail(entitesDetailReducer(INVENTORY_ACTION_TYPES))
        });

        const { InventoryDetailHead, AppInfo } = inventoryConnector();

        this.setState({
            InventoryDetail: InventoryDetailHead,
            AppInfo
        });
    }

    componentWillUnmount() {
        this.entityListener();
    }

    onNavigate(navigateTo) {
        const { history } = this.props;
        history.push(`/${navigateTo}`);
    }

    render() {
        const { InventoryDetail, AppInfo } = this.state;
        const { entity } = this.props;
        return (
            <Fragment>
                <PageHeader className="pf-m-light ins-inventory-detail">
                    <Breadcrumbs
                        items={[{ title: 'Your app', navigate: 'some_endpoint' }]}
                        current={entity && entity.display_name}
                        onNavigate={(_event, navigateTo) => this.onNavigate(navigateTo)}
                    />
                    {InventoryDetail && <InventoryDetail hideBack />}
                </PageHeader>
                <Main>
                    <Grid gutter="md">
                        <GridItem span={12}>
                            {AppInfo && <AppInfo />}
                        </GridItem>
                    </Grid>
                </Main>
            </Fragment>
        );
    }
}

Inventory.contextTypes = {
    store: PropTypes.object
};

Inventory.propTypes = {
    history: PropTypes.object,
    entity: PropTypes.object,
    addAlert: PropTypes.func,
    loadEntities: PropTypes.func,
    loadEntity: PropTypes.func
};

function mapStateToProps({ entityDetails }) {
    return {
        entity: entityDetails && entityDetails.entity
    };
}

export default routerParams(connect(mapStateToProps, null)(Inventory));

```
        
