import React, { useRef, useEffect, useState } from 'react';
import propTypes from 'prop-types';
import {
    Text,
    TextContent,
    Stack, StackItem
} from '@patternfly/react-core';
import './selectPlaybook.scss';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import { BrowserRouter as Router } from 'react-router-dom';
import ReducerRegistry, { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';

const entitySelected = (state, { payload }) => {
    const selected = state.selected || new Map();
    if (payload.selected) {
        if (payload.id === 0) {
            state.rows.forEach((row) => selected.set(row.id, row));
        } else {
            const selectedRow = state?.rows?.find(({ id } = {}) => id === payload.id);
            selected.set(payload.id, { ...(selectedRow || {}), id: payload.id });
        }
    } else {
        if (payload.id === 0) {
            state.rows.forEach((row) => selected.delete(row.id));
        } else if (payload.id === -1) {
            selected.clear();
        } else {
            selected.delete(payload.id);
        }
    }

    return {
        ...state,
        selected: new Map(selected)
    };
};

const entitiesReducer = applyReducerHash({
    SELECT_ENTITY: entitySelected
});

const ReviewSystems = ({ issues, systems }) => {
    const [ registry, setRegistry ] = useState();
    const [ inventoryApi, setInventoryApi ] = useState();
    useEffect(() => {
        setRegistry(
            () => new ReducerRegistry(
                {
                    selected: new Map()
                },
                [ promiseMiddleware ]
            )
        );
    }, []);
    const allSystems = [ ...new Set(issues.reduce((acc, curr) => [
        ...acc,
        ...(curr.systems || [])
    ], [ ...systems ])) ];
    const inventory = useRef(null);
    const onRefresh = (options, callback) => {
        if (!callback && inventory && inventory.current) {
            inventory.current.onRefreshData(options);
        } else if (callback) {
            callback(options);
        }
    };

    return (
        <Stack hasGutter>
            <StackItem>
                <TextContent>
                    <Text>
                        Review and optionally exclude systems from your selection.
                    </Text>
                </TextContent>
            </StackItem>
            <StackItem>
                {
                    registry && registry?.store  && <Provider store={registry?.store}>
                        <Router>
                            <InventoryTable
                                noDetail
                                variant="compact"
                                showTags
                                onRefresh={onRefresh}
                                ref={inventory}
                                getEntities={async (_i, config) => {
                                    // deal with pagination here
                                    const data = await inventoryApi?.getEntities(allSystems, {
                                        ...config,
                                        filters: undefined,
                                        hasItems: true
                                    });
                                    return data;
                                }}
                                onLoad={({ mergeWithEntities, api }) => {
                                    registry.register(mergeWithEntities(entitiesReducer));
                                    setInventoryApi(() => api);
                                }
                                }
                            >
                            </InventoryTable>
                        </Router>
                    </Provider>
                }
            </StackItem>
        </Stack >
    );
};

ReviewSystems.propTypes = {
    systems: propTypes.arrayOf(propTypes.string).isRequired,
    issues: propTypes.arrayOf(propTypes.shape({
        description: propTypes.string,
        id: propTypes.string
    })).isRequired
};
export default ReviewSystems;
