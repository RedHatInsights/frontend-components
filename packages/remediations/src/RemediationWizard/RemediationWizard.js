import React, { useEffect, useRef, useState } from 'react';
import propTypes from 'prop-types';
import { fetchHostsById } from '../redux/actions/host-actions';
import { fetchResolutions } from '../redux/actions/resolution-actions';
import { Provider, useDispatch } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import hostReducer, { hostsInitialState } from '../redux/reducers/host-reducer';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry/ReducerRegistry';
import keyBy from 'lodash/keyBy';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';
import schemaBuilder from './schema';
import Wizard from '@data-driven-forms/pf4-component-mapper/dist/esm/wizard';
import TextField from '@data-driven-forms/pf4-component-mapper/dist/esm/text-field';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/esm/component-types';
import SelectPlaybook from '../steps/selectPlaybook';
import ReviewActions from '../steps/reviewActions';
import IssueResolution from '../steps/issueResolution';
import Review from '../steps/review';
import ReviewSystems from '../steps/reviewSystems';
import resolutionsReducer, { resolutionsInitialState } from '../redux/reducers/resolutions-reducer';
import {
    dedupeArray,
    submitRemediation,
    splitArray,
    SELECTED_RESOLUTIONS,
    EXISTING_PLAYBOOK_SELECTED,
    MANUAL_RESOLUTION,
    SYSTEMS,
    RESOLUTIONS,
    ISSUES_MULTIPLE
} from '../utils';

const RemediationWizard = ({
    setOpen,
    data,
    basePath,
    registry
}) => {

    const allSystems = useRef(
        dedupeArray(data.issues.reduce((acc, curr) => [
            ...acc,
            ...(curr.systems || [])
        ], [ ...data.systems ]))
    );

    const dispatch = useDispatch();

    const issuesById = keyBy(data.issues, issue => issue.id);
    const [ schema, setSchema ] = useState();

    const fetchHostNames = (systems = []) => {
        const perChunk = 50;
        const chunks = splitArray(systems, perChunk);
        chunks.forEach(chunk => {
            dispatch(fetchHostsById(chunk, { page: 1, perPage: perChunk }));
        });
    };

    useEffect(() => {
        setSchema(schemaBuilder(data.issues));
        registry.register({
            hostReducer: applyReducerHash(hostReducer, hostsInitialState),
            resolutionsReducer: applyReducerHash(resolutionsReducer, resolutionsInitialState)
        });
        dispatch(fetchResolutions(data.issues));
        fetchHostNames(allSystems.current);
    }, []);

    const mapperExtension = {
        'select-playbook': {
            component: SelectPlaybook,
            issues: data.issues,
            systems: data.systems,
            allSystems: allSystems.current
        },
        'review-systems': {
            component: ReviewSystems,
            issues: data.issues,
            systems: data.systems,
            allSystems: allSystems.current,
            registry
        },
        'review-actions': {
            component: ReviewActions,
            issues: data.issues
        },
        'issue-resolution': {
            component: IssueResolution
        },
        review: {
            component: Review,
            data,
            issuesById: issuesById
        }
    };

    const validatorMapper = {
        'validate-systems': () => (value) => (
            value && Object.keys(value).length > 0
                ? undefined
                : 'At least one system must be selected. Actions must be associated to a system to be added to a playbook.')
    };

    return (
        schema ?
            <FormRenderer
                schema={schema}
                subscription={{ values: true }}
                FormTemplate={(props) => <Pf4FormTemplate {...props} showFormControls={false} />}
                initialValues={{
                    [RESOLUTIONS]: [],
                    [ISSUES_MULTIPLE]: [],
                    [SYSTEMS]: {},
                    [MANUAL_RESOLUTION]: true,
                    [SELECTED_RESOLUTIONS]: {},
                    [EXISTING_PLAYBOOK_SELECTED]: false
                }}
                componentMapper={{
                    [componentTypes.WIZARD]: {
                        component: Wizard,
                        'data-ouia-component-id': 'remediation-wizard'
                    },
                    [componentTypes.TEXT_FIELD]: TextField,
                    ...mapperExtension
                }}
                validatorMapper={validatorMapper}
                onSubmit={(formValues) => {
                    submitRemediation(formValues, data, basePath);
                    setOpen(false);
                }}
                onCancel={() => setOpen(false)}
            /> : null
    );
};

RemediationWizard.propTypes = {
    setOpen: propTypes.func.isRequired,
    data: propTypes.shape({
        issues: propTypes.arrayOf(propTypes.shape({
            description: propTypes.string,
            id: propTypes.string
        })),
        systems: propTypes.arrayOf(propTypes.string),
        onRemediationCreated: propTypes.func
    }).isRequired,
    basePath: propTypes.string,
    registry: propTypes.instanceOf(ReducerRegistry).isRequired
};

const RemediationWizardWithContext = (props) => {
    const [ registry, setRegistry ] = useState();

    useEffect(() => {
        setRegistry(() => new ReducerRegistry({}, [ promiseMiddleware ]));
    }, []);

    return registry?.store  ? <Provider store={registry.store}>
        <RemediationWizard {...props} registry={registry} />
    </Provider> : null;
};

export default RemediationWizardWithContext;
