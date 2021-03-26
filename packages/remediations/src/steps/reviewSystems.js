import React, { useRef, useEffect, useState } from 'react';
import propTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/esm/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/esm/use-form-api';
import promiseMiddleware from 'redux-promise-middleware';
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import {
    Text,
    TextContent,
    Stack, StackItem
} from '@patternfly/react-core';
import {
    dedupeArray,
    fetchSystemsInfo,
    inventoryEntitiesReducer as entitiesReducer,
    EXISTING_PLAYBOOK,
    TOGGLE_BULK_SELECT
} from '../utils';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import './reviewSystems.scss';
import isEqual from 'lodash/isEqual';

const ReviewSystems = ({ issues, systems, registry, ...props }) => {

    let dispatch = useDispatch();
    const inventory = useRef(null);
    const { input } = useFieldApi(props);
    const formOptions = useFormApi();
    const inventoryApi = useRef({});

    const rowsLength = useSelector(({ entities }) => (entities?.rows || []).length);
    const selected = useSelector(({ entities }) => entities?.selected || []);
    const loaded = useSelector(({ entities }) => entities?.loaded);

    const formValues = formOptions.getState().values;
    const error = formOptions.getState().errors?.systems;
    const playbook = formValues && formValues[EXISTING_PLAYBOOK];

    const allNewSystems = dedupeArray(issues.reduce((acc, curr) => [
        ...acc,
        ...(curr.systems || [])
    ], [ ...systems ]));

    const allSystems = playbook ? dedupeArray(playbook.issues?.reduce((acc, curr) => [
        ...acc,
        ...(curr.systems?.map(system => system.id) || [])
    ], [ ...allNewSystems ])) : allNewSystems;

    const onRefresh = (options, callback) => {
        if (!callback && inventory && inventory.current) {
            inventory.current.onRefreshData(options);
        } else if (callback) {
            callback(options);
        }
    };

    const onSelectRows = (value) => {
        dispatch({
            type: TOGGLE_BULK_SELECT,
            payload: value
        });
    };

    useEffect(() => {
        if (!isEqual(input.value, selected)) {
            input.onChange(selected);
        }
    });

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
                            getEntities={(_i, config) => fetchSystemsInfo(config, allSystems, inventoryApi.current)}
                            onLoad={({ mergeWithEntities, api, INVENTORY_ACTION_TYPES }) => {
                                registry.register(mergeWithEntities(entitiesReducer(allSystems, INVENTORY_ACTION_TYPES)));
                                inventoryApi.current = api;
                            }}
                            bulkSelect={{
                                id: 'select-systems',
                                count: selected.length,
                                items: [{
                                    title: 'Select none (0)',
                                    onClick: () => onSelectRows(false)
                                },
                                {
                                    ...loaded && rowsLength > 0 ? {
                                        title: `Select page (${ rowsLength })`,
                                        onClick: () => onSelectRows(true)
                                    } : {}
                                }],
                                checked: selected.length > 0,
                                onSelect: (value) => onSelectRows(value)
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

    return registry?.store  ? <Provider store={registry.store}>
        <ReviewSystems {...props} registry={registry} />
    </Provider> : null;
};

export default ReviewSystemsWithContext;
