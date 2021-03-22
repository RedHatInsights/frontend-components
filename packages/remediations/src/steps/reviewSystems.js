import React, { useRef, useEffect, useState, Fragment } from 'react';
import propTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/esm/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/esm/use-form-api';
import {
    Text,
    TextContent,
    Stack, StackItem
} from '@patternfly/react-core';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { Provider, useDispatch, useSelector } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import { BrowserRouter as Router } from 'react-router-dom';
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { EXISTING_PLAYBOOK, inventoryEntitiesReducer as entitiesReducer, TOGGLE_BULK_SELECT } from '../utils';
import './reviewSystems.scss';

const ReviewSystems = (props) => {
    const { issues, systems, registry } = props;

    let dispatch = useDispatch();
    const inventory = useRef(null);
    const { input } = useFieldApi(props);
    const formOptions = useFormApi();

    const [ inventoryApi, setInventoryApi ] = useState();

    const { selected, loaded, rows } = useSelector(({ entities }) => ({
        selected: entities?.selected || [],
        loaded: entities?.loaded,
        rows: entities?.rows || []
    }));

    const formValues = formOptions.getState().values;
    const error = formOptions.getState().errors?.systems;
    const playbook = formValues && formValues[EXISTING_PLAYBOOK];

    const allNewSystems = [ ...new Set(issues.reduce((acc, curr) => [
        ...acc,
        ...(curr.systems || [])
    ], [ ...systems ])) ];

    const allSystems = playbook ? [ ...new Set(playbook.issues?.reduce((acc, curr) => [
        ...acc,
        ...(curr.systems?.map(system => system.id) || [])
    ], [ ...allNewSystems ]))
    ] : allNewSystems;

    const onRefresh = (options, callback) => {
        if (!callback && inventory && inventory.current) {
            inventory.current.onRefreshData(options);
        } else if (callback) {
            callback(options);
        }
    };

    const onSelect = (selected) => {
        input.onChange(selected);
    };

    const onSelectRows = (value) => {
        dispatch({
            type: TOGGLE_BULK_SELECT,
            payload: value
        });
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
                    <Router>
                        <InventoryTable
                            hideFilters={{ all: true }}
                            noDetail
                            variant="compact"
                            showTags
                            onRefresh={onRefresh}
                            ref={inventory}
                            getEntities={async (_i, config) => {
                                const invData = await inventoryApi?.getEntities(allSystems, {
                                    ...config,
                                    hasItems: true
                                });
                                const data = await inventoryApi?.mapTags(invData);
                                return data;
                            }}
                            onLoad={({ mergeWithEntities, api }) => {
                                registry.register(mergeWithEntities(entitiesReducer(onSelect, input.value)));
                                setInventoryApi(() => api);
                            }
                            }
                            bulkSelect={{
                                id: 'select-systems',
                                count: selected.length,
                                items: [{
                                    title: 'Select none (0)',
                                    onClick: () => onSelectRows(false)
                                },
                                {
                                    ...loaded && rows && rows.length > 0 ? {
                                        title: `Select page (${ rows.length })`,
                                        onClick: () => {
                                            onSelectRows(true);
                                        }
                                    } : {}
                                }],
                                checked: selected.length > 0,
                                onSelect: (value) => {
                                    onSelectRows(value);
                                }
                            }}
                            tableProps={{
                                canSelectAll: false
                            }}
                        >
                        </InventoryTable>
                    </Router>
                }
            </StackItem>
            { error && loaded &&
                <StackItem>
                    <ExclamationCircleIcon className="ins-c-remediations-error pf-u-mr-sm"/>
                    <span className="ins-c-remediations-error">{error}</span>
                </StackItem>
            }
        </Stack >
    );
};

ReviewSystems.propTypes = {
    systems: propTypes.arrayOf(propTypes.string).isRequired,
    issues: propTypes.arrayOf(propTypes.shape({
        description: propTypes.string,
        id: propTypes.string
    })).isRequired,
    registry: propTypes.object.isRequired
};

const ReviewSystemsWithContext = (props) => {
    const [ registry, setRegistry ] = useState();

    useEffect(() => {
        setRegistry(() => new ReducerRegistry({}, [ promiseMiddleware ]));
    }, []);

    return (
        <Fragment>
            {
                registry && registry?.store  && <Provider store={registry?.store}>
                    <ReviewSystems {...props} registry={registry} />
                </Provider>
            }
        </Fragment>
    );
};

export default ReviewSystemsWithContext;
