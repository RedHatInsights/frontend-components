/* eslint-disable camelcase */
import React, { Fragment } from 'react';
import { CloseIcon, RedoIcon } from '@patternfly/react-icons';
import urijs from 'urijs';
import * as api from '../api';
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry/ReducerRegistry';
import { Table, TableBody, TableHeader, TableVariant } from '@patternfly/react-table';

export const CAN_REMEDIATE = 'remediations:remediation:write';

export const AUTO_REBOOT = 'auto-reboot';
export const HAS_MULTIPLES = 'has-multiples';
export const SELECT_PLAYBOOK = 'select-playbook';
export const SELECTED_RESOLUTIONS = 'selected-resolutions';
export const MANUAL_RESOLUTION = 'manual-resolution';
export const EXISTING_PLAYBOOK_SELECTED = 'existing-playbook-selected';
export const EXISTING_PLAYBOOK = 'existing-playbook';
export const SYSTEMS = 'systems';
export const RESOLUTIONS = 'resolutions';
export const ISSUES_MULTIPLE = 'issues-multiple';

export const TOGGLE_BULK_SELECT = 'toggle-bulk-select';

// Get the current group since we can be mounted at two urls
export function getGroup () {
    const pathName = window.location.pathname.split('/');

    if (pathName[1] === 'beta') {
        return pathName[2];
    }

    return pathName[1];
}

export function remediationUrl (id) {
    return urijs(document.baseURI).segment(getGroup()).segment('remediations').segment(id).toString();
}

export const dedupeArray = (array) => [ ...new Set(array) ];

export const pluralize = (count, str, fallback) => count !== 1 ? (fallback || str + 's') : str;

const sortRecords = (records, sortByState) => [ ...records ].sort(
    (a, b) => {
        const key = Object.keys(a)[sortByState.index - 1];
        return (
            (a[key] > b[key] ? 1 :
                a[key] < b[key] ? -1 : 0)
                * (sortByState.direction === 'desc' ? -1 : 1)
        );
    }
);

export const buildRows = (records, sortByState, showAlternate) => sortRecords(records, sortByState).reduce((acc, curr, index) => [
    ...acc,
    {
        isOpen: false,
        cells: [
            { title: curr.action },
            { title: <Fragment key={`${index}-description`}>
                <p key={`${index}-resolution`}>
                    {curr.resolution}
                </p>
                {showAlternate && curr.alternate > 0 &&
                    (
                        <p key={`${index}-alternate`}>{curr.alternate} alternate {pluralize(curr.alternate, 'resolution')}</p>
                    )}
            </Fragment>
            },
            {
                title: curr.needsReboot ? <div><RedoIcon className="pf-u-mr-sm"/>Yes</div> : <div><CloseIcon className="pf-u-mr-sm"/>No</div>
            },
            {
                title: curr.systems?.length || 0,
                props: { isOpen: false }
            }
        ]
    },
    ...(curr.systems?.length > 0 ? [{
        parent: index * 2,
        cells: [
            {
                title: (
                    <Fragment>
                        <Table
                            aria-label="Systems affected"
                            variant={TableVariant.compact}
                            cells={[
                                { title: 'Systems affected' }
                            ]}
                            rows={curr.systems.map(s => [ s ])}
                            className="pf-m-no-border-rows"
                        >
                            <TableHeader />
                            <TableBody />
                        </Table>
                    </Fragment>
                ),
                props: { colSpan: 4, className: 'pf-m-no-padding' }
            }
        ]
    }] : []) ], []);

export const onCollapse = (event, rowKey, isOpen, rows, setRows) => {
    let temp = [ ...rows ];
    rows[rowKey].isOpen = isOpen;
    setRows(temp);
};

export const getResolution = (issueId, formValues) => {
    const issueResolutions = formValues[RESOLUTIONS].find(r => r.id === issueId)?.resolutions || [];

    if (formValues[MANUAL_RESOLUTION] && issueId in formValues[SELECTED_RESOLUTIONS]) {
        return issueResolutions.filter(r => r.id === formValues[SELECTED_RESOLUTIONS][issueId]);
    }

    if (formValues[EXISTING_PLAYBOOK_SELECTED]) {
        const existing = formValues[EXISTING_PLAYBOOK]?.issues?.find(i => i.id === issueId);

        if (existing) {
            return issueResolutions.filter(r => r.id === existing.resolution.id);
        }
    }

    return issueResolutions;
};

export function createNotification(id, name, isNewSwitch, error = false) {
    const verb = isNewSwitch ? 'created' : 'updated';
    return error
        ? {
            variant: 'danger',
            title: `Failed to ${verb.slice(0, -1)} playbook`,
            description: <span>Playbook was not {verb} successfully.</span>,
            dismissable: true
        }
        : {
            variant: 'success',
            title: `Playbook ${verb}`,
            description: <span>You have successfully {verb} <a href={remediationUrl(id)}>{name}</a>.</span>,
            dismissable: true
        };
}

export const submitRemediation = (formValues, data, basePath) => {
    const resolver = (id, name, isNewSwitch, onRemediationCreated, error) => onRemediationCreated({
        remediation: { id, name },
        getNotification: () => createNotification(id, name, isNewSwitch, error)
    });
    const playbook = formValues[EXISTING_PLAYBOOK];
    const issues = data.issues.map(({ id }) => {
        const playbookSystems = playbook?.issues?.find(i => i.id === id)?.systems?.map(s => s.id) || [];
        return ({
            id,
            resolution: getResolution(id, formValues)?.[0]?.id,
            systems: dedupeArray([
                ...(formValues[EXISTING_PLAYBOOK_SELECTED] ? [] : playbookSystems),
                ...(formValues[SYSTEMS][id] || [])
            ])
        });}).filter(issue => issue.systems.length > 0);
    const add = { issues, systems: [] };
    if (formValues[EXISTING_PLAYBOOK_SELECTED]) {
        const { id, name } = formValues[EXISTING_PLAYBOOK];
        api.patchRemediation(id, { add, auto_reboot: formValues[AUTO_REBOOT] }, basePath)
        .then(() => resolver(id, name, false, data.onRemediationCreated))
        .catch(() => resolver(null, name, false, data.onRemediationCreated, true));
    } else {
        api.createRemediation({ name: formValues[SELECT_PLAYBOOK], add, auto_reboot: formValues[AUTO_REBOOT] }, basePath)
        .then(({ id }) => resolver(id, formValues[SELECT_PLAYBOOK], true, data.onRemediationCreated))
        .catch(() => resolver(null, formValues[SELECT_PLAYBOOK], true, data.onRemediationCreated, true));
    }
};

export const entitySelected = (state, { payload }) => {
    let selected = state.selected || [];
    if (payload.selected) {
        selected = [
            ...selected,
            ...payload.id === 0 ? state.rows.map(row => row.id) : [ payload.id ]
        ];
    } else {
        if (payload.id === 0) {
            const rowsIds = state.rows.map(row => row.id);
            selected = selected.filter(item => !rowsIds.includes(item));
        } else {
            selected = payload.id === -1 ? [] : selected.filter(item => item !== payload.id);
        }
    }

    return {
        ...state,
        selected
    };
};

export const loadEntitiesFulfilled = (state, allSystems) => {
    let selected = state.selected || [];
    if (!state.selected) {
        selected = allSystems ? allSystems : state.rows.map(row => row.id);
    }

    return ({
        ...state,
        selected,
        rows: state.rows.map(({ id, ...row }) => ({
            id,
            ...row,
            selected: !!selected?.includes(id)
        }))
    });
};

export const changeBulkSelect = (state, action) => {
    const removeSelected = !action.payload;
    if (!removeSelected) {
        state.selected = dedupeArray([
            ...state.selected,
            ...state.rows.map(row => row.id)
        ]);
    }

    return ({
        ...state,
        selected: removeSelected ? [] : state.selected,
        rows: state.rows.map(({ id, ...row }) => ({
            id,
            ...row,
            selected: !removeSelected
        }))
    });
};

export const fetchSystemsInfo = async (config, allSystemsNamed = [], { getEntities } = {}) => {
    const hostnameOrId = config?.filters?.hostnameOrId?.toLowerCase();
    const systems = (
        hostnameOrId
            ?
            allSystemsNamed.reduce((acc, curr) => [
                ...acc,
                ...(curr.display_name.toLowerCase().includes(hostnameOrId) || curr.id.toLowerCase().includes(hostnameOrId)
                    ? [ curr.id ]
                    : []
                )
            ], [])
            : allSystemsNamed.map(system => system.id)
    );
    const sliced = systems.slice((config.page - 1) * config.per_page, config.page * config.per_page);
    const data = sliced.length > 0 ? await getEntities(sliced, { ...config, hasItems: true, page: 1 }, true) : {};
    return {
        ...data,
        total: systems.length,
        page: config.page,
        per_page: config.per_page
    };
};

export const splitArray = (inputArray, perChunk) => [ ...new Array(Math.ceil(inputArray.length / perChunk)) ].map(
    (_item, key) => inputArray.slice(key * perChunk, (key + 1) * perChunk)
);

export const getPlaybookSystems = (playbook) => playbook && uniqWith(playbook.issues?.reduce((acc, curr) => [
    ...acc,
    ...(curr.systems.map(system => ({ id: system.id, display_name: system.display_name })))
], []), isEqual) || [];

export const inventoryEntitiesReducer = (allSystems, { LOAD_ENTITIES_FULFILLED }) => applyReducerHash({
    SELECT_ENTITY: (state, action) => entitySelected(state, action),
    [LOAD_ENTITIES_FULFILLED]: (state) => loadEntitiesFulfilled(state, allSystems),
    [TOGGLE_BULK_SELECT]: changeBulkSelect
});

export const shortenIssueId = (issueId) => issueId?.split('|')?.slice(-1)?.[0] || issueId;

export const getIssuesMultiple = (issues = [], systems = [], resolutions = []) =>
    issues.map(issue => {
        const issueResolutions = resolutions.find(r => r.id === issue.id)?.resolutions || [];
        const { description, needs_reboot: needsReboot  } = issueResolutions?.[0] || {};
        return {
            action: issues.find(i => i.id === issue.id).description,
            resolution: description,
            needsReboot,
            systems: dedupeArray([ ...(issue.systems || []), systems ]),
            id: issue.id,
            alternate: issueResolutions?.length - 1
        };
    }).filter(record => record.alternate > 0);
