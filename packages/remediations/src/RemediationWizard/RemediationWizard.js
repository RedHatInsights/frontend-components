import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { fetchHostsById } from '../redux/actions/host-actions';
import { Provider, useDispatch } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import hostReducer, { hostsInitialState } from '../redux/reducers/host-reducer';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry/ReducerRegistry';
import keyBy from 'lodash/keyBy';
import transform from 'lodash/transform';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';
import schemaBuilder from './schema';
import * as api from '../api';
import Wizard from '@data-driven-forms/pf4-component-mapper/dist/esm/wizard';
import TextField from '@data-driven-forms/pf4-component-mapper/dist/esm/text-field';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/esm/component-types';
import SelectPlaybook from '../steps/selectPlaybook';
import ReviewActions from '../steps/reviewActions';
import IssueResolution from '../steps/issueResolution';
import FetchError from '../steps/fetchError';
import Review from '../steps/review';
import ReviewSystems from '../steps/reviewSystems';
import {
    submitRemediation,
    splitArray,
    HAS_MULTIPLES,
    SELECTED_RESOLUTIONS,
    EXISTING_PLAYBOOK_SELECTED,
    MANUAL_RESOLUTION,
    SYSTEMS
} from '../utils';

const RemediationWizard = ({
    setOpen,
    data,
    basePath,
    registry
}) => {

    const dispatch = useDispatch();

    const [ state, setState ] = useState({ errors: [] });

    const getIssuesMultiple = (issuesById, resolutions = []) =>
        data.issues.map(issue => {
            const issueResolutions = resolutions.find(r => r.id === issue.id)?.resolutions || [];
            const { description, needs_reboot: needsReboot  } = issueResolutions?.[0] || {};
            return {
                action: issuesById[issue.id].description,
                systemsCount: issue.systems ? issue.systems.length : data.systems.length,
                id: issue.id,
                shortId: issue?.id?.split('|')?.slice(-1)?.[0] || issue.id,
                resolution: description,
                needsReboot,
                alternate: issueResolutions?.length - 1
            };
        }).filter(record => record.alternate > 0);

    const loadResolutions = async (issues) => {
        try {
            const result = await api.getResolutionsBatch(issues.map(i => i.id));

            const [ resolutions, warnings ] = transform(result, ([ resolutions, errors ], value, key) => {
                if (!value) {
                    errors.push(`Issue ${key} does not have Ansible support`);
                } else {
                    resolutions.push(value);
                }

                return [ resolutions, errors ];
            }, [ [], [] ]);

            return { resolutions, warnings };
        } catch (e) {
            return { errors: [ 'Error obtaining resolution information. Please try again later.' ] };
        }
    };

    const fetchHostNames = (systems = []) => {
        const perChunk = 50;
        const chunks = splitArray(systems, perChunk);
        chunks.map(chunk => {
            dispatch(fetchHostsById(chunk, { page: 1, perPage: perChunk }));
        });
    };

    useEffect(() => {
        registry.register({ hostReducer: applyReducerHash(hostReducer, hostsInitialState) });
        const issuesById = keyBy(data.issues, issue => issue.id);
        loadResolutions(data.issues).then(
            (values) => {
                const issuesMultiple = getIssuesMultiple(issuesById, values.resolutions);
                setState({
                    ...state,
                    ...values,
                    schema: schemaBuilder(issuesMultiple),
                    issuesById,
                    issuesMultiple,
                    basePath,
                    isLoaded: true
                });
            }
        );
        fetchHostNames(data.systems);
    }, []);

    const mapperExtension = {
        'select-playbook': {
            component: (state.errors.length > 0 || (state.resolutions || []).length === 0) ? FetchError : SelectPlaybook,
            resolutionsCount: (state.resolutions || []).length,
            warnings: state.warnings,
            issues: data.issues,
            systems: data.systems
        },
        'review-systems': {
            component: ReviewSystems,
            issues: data.issues,
            systems: data.systems,
            registry
        },
        'review-actions': {
            component: ReviewActions,
            issues: data.issues,
            issuesMultiple: state.issuesMultiple
        },
        'issue-resolution': {
            component: IssueResolution,
            systems: data.systems,
            resolutions: state.resolutions
        },
        review: {
            component: Review,
            data: data,
            issuesById: state.issuesById,
            resolutions: state.resolutions
        }
    };

    const validatorMapper = {
        'validate-systems': () => (value) => (
            value && value.length > 0
                ? undefined
                : 'At least one system must be selected. Actions must be associated to a system to be added to a playbook.')
    };

    return (
        state.isLoaded ?
            <FormRenderer
                schema={state.schema}
                subscription={{ values: true }}
                FormTemplate={(props) => <Pf4FormTemplate {...props} showFormControls={false} />}
                initialValues={{
                    [HAS_MULTIPLES]: !!state.resolutions?.find(r => r.resolutions.length > 1),
                    [SYSTEMS]: undefined,
                    [MANUAL_RESOLUTION]: true,
                    [SELECTED_RESOLUTIONS]: {},
                    [EXISTING_PLAYBOOK_SELECTED]: false
                }}
                componentMapper={{
                    [componentTypes.WIZARD]: Wizard,
                    [componentTypes.TEXT_FIELD]: TextField,
                    ...mapperExtension
                }}
                validatorMapper={validatorMapper}
                onSubmit={(formValues) => {
                    submitRemediation(formValues, data, basePath, state.resolutions);
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
    registry: propTypes.object.isRequired
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
