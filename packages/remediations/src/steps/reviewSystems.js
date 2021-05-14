/* eslint-disable camelcase */
import React, { useEffect, useRef, useState } from 'react';
import propTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/esm/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/esm/use-form-api';
import {
    Text,
    TextContent,
    Stack, StackItem
} from '@patternfly/react-core';
import {
    dedupeArray,
    fetchSystemsInfo,
    getPlaybookSystems,
    inventoryEntitiesReducer as entitiesReducer,
    EXISTING_PLAYBOOK,
    TOGGLE_BULK_SELECT,
    EXISTING_PLAYBOOK_SELECTED
} from '../utils';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import isEqual from 'lodash/isEqual';
import unionWith from 'lodash/unionWith';
import './reviewSystems.scss';

const ReviewSystems = ({ issues, systems, registry, ...props }) => {

    let dispatch = useDispatch();
    const inventory = useRef(null);
    const { input } = useFieldApi(props);
    const formOptions = useFormApi();
    const inventoryApi = useRef({});

    const formValues = formOptions.getState().values;
    const playbook = formValues[EXISTING_PLAYBOOK];
    const error = formOptions.getState().errors?.systems;

    const rowsLength = useSelector(({ entities }) => (entities?.rows || []).length);
    const selected = useSelector(({ entities }) => entities?.selected || []);
    const loaded = useSelector(({ entities }) => entities?.loaded);
    const newSystemsNamed = useSelector(({ hostReducer: { hosts } }) => hosts?.map(host => (
        { id: host.id, display_name: host.display_name })) || []
    );

    const allSystems = useRef([]);
    const [ allSystemsNamed, setAllSystemsNamed ] = useState([]);

    useEffect(() => {
        const playbookSystems = formValues?.[EXISTING_PLAYBOOK_SELECTED] ? getPlaybookSystems(playbook) : [];
        setAllSystemsNamed(unionWith(playbookSystems, newSystemsNamed, isEqual));
        allSystems.current = dedupeArray([
            ...dedupeArray(issues.reduce((acc, curr) => [
                ...acc,
                ...(curr.systems || [])
            ], [ ...systems ])),
            ...(playbookSystems.map(system => system.id))
        ]);
    }, [ playbook, issues, systems ]);

    useEffect(() => {
        if (!isEqual(input.value, selected)) {
            input.onChange(selected);
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
                                registry.register(mergeWithEntities(entitiesReducer(allSystems.current, INVENTORY_ACTION_TYPES)));
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
    systems: propTypes.arrayOf(propTypes.string).isRequired,
    issues: propTypes.arrayOf(propTypes.shape({
        description: propTypes.string,
        id: propTypes.string
    })).isRequired,
    registry: propTypes.instanceOf(ReducerRegistry).isRequired
};

export default ReviewSystems;
