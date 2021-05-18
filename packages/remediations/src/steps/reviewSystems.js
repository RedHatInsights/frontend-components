/* eslint-disable camelcase */
import React, { useEffect, useRef } from 'react';
import propTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/esm/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/esm/use-form-api';
import {
    Text,
    TextContent,
    Stack, StackItem
} from '@patternfly/react-core';
import {
    fetchSystemsInfo,
    inventoryEntitiesReducer as entitiesReducer,
    TOGGLE_BULK_SELECT
} from '../utils';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import isEqual from 'lodash/isEqual';
import './reviewSystems.scss';

const ReviewSystems = ({ issues, systems, allSystems, registry, ...props }) => {

    let dispatch = useDispatch();
    const inventory = useRef(null);
    const { input } = useFieldApi(props);
    const formOptions = useFormApi();
    const inventoryApi = useRef({});

    const error = formOptions.getState().errors?.systems;

    const rowsLength = useSelector(({ entities }) => (entities?.rows || []).length);
    const selected = useSelector(({ entities }) => entities?.selected || []);
    const loaded = useSelector(({ entities }) => entities?.loaded);
    const allSystemsNamed = useSelector(({ hostReducer: { hosts } }) => hosts?.map(host => (
        { id: host.id, display_name: host.display_name })) || []
    );

    useEffect(() => {
        const value = issues.reduce((acc, curr) => {
            const tempSystems = [ ...systems, ...curr.systems ].filter(id => selected?.includes(id));
            return ({
                ...acc,
                ...(tempSystems.length > 0 ? { [curr.id]: tempSystems } : {})
            });
        }, {});
        if (!isEqual(input.value, value)) {
            input.onChange(value);
        }
    }, [ selected ]);

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

    return (
        <Stack hasGutter data-component-ouia-id="wizard-review-systems">
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
                            hideFilters={{
                                tags: true,
                                registeredWith: true,
                                stale: true
                            }}
                            noDetail
                            variant="compact"
                            showTags
                            onRefresh={onRefresh}
                            ref={inventory}
                            getEntities={(_i, config) => fetchSystemsInfo(config, allSystemsNamed, inventoryApi.current)}
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
                                ...loaded && rowsLength > 0 ? [{
                                    title: `Select page (${ rowsLength })`,
                                    onClick: () => onSelectRows(true)
                                }] : []
                                ],
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
    issues: propTypes.arrayOf(propTypes.shape({
        description: propTypes.string,
        id: propTypes.string
    })).isRequired,
    systems: propTypes.arrayOf(propTypes.string).isRequired,
    allSystems: propTypes.arrayOf(propTypes.string).isRequired,
    registry: propTypes.instanceOf(ReducerRegistry).isRequired
};

export default ReviewSystems;
