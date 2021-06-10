import React, { Fragment, useEffect, useReducer, useRef, useState } from 'react';
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
import WizardMapper from '@data-driven-forms/pf4-component-mapper/dist/esm/wizard';
import { Modal, Wizard } from '@patternfly/react-core';
import TextField from '@data-driven-forms/pf4-component-mapper/dist/esm/text-field';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/esm/component-types';
import SelectPlaybook from '../steps/selectPlaybook';
import ReviewSystems from '../steps/reviewSystems';
import ReviewActions from '../steps/reviewActions';
import IssueResolution from '../steps/issueResolution';
import Review from '../steps/review';
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
import Progress from '../steps/progress';
import { ModalVariant } from '@patternfly/react-core/dist/esm/components/Modal/Modal';

const initialState = {
    submitted: false,
    id: undefined,
    percent: 0,
    failed: false,
    formValues: undefined
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'schema':
            return { ...state, schema: action.payload };
        case 'formValues':
            return { ...state, formValues: action.payload };
        case 'state':
            return { ...state, ...action.payload };
        default:
            throw new Error();
    }
};

export const RemediationWizard = ({
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

    const [ state, setState ] = useReducer(reducer, initialState);

    const issuesById = keyBy(data.issues, issue => issue.id);

    const fetchHostNames = (systems = []) => {
        const perChunk = 50;
        const chunks = splitArray(systems, perChunk);
        chunks.forEach(chunk => {
            dispatch(fetchHostsById(chunk, { page: 1, perPage: perChunk }));
        });
    };

    useEffect(() => {
        setState({ type: 'schema', payload: schemaBuilder(data.issues) });
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
            value && Object.values(value).filter(value => typeof value !== undefined).length
                ? undefined
                : 'At least one system must be selected. Actions must be associated to a system to be added to a playbook.')
    };

    return (
        <Fragment>
            { state.schema && !state.submitted ?
                <FormRenderer
                    schema={state.schema}
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
                            component: WizardMapper,
                            'data-ouia-component-id': 'remediation-wizard'
                        },
                        [componentTypes.TEXT_FIELD]: TextField,
                        ...mapperExtension
                    }}
                    validatorMapper={validatorMapper}
                    onSubmit={(formValues) => {
                        setState({ type: 'state', payload: { submitted: true, formValues: formValues } });
                        submitRemediation(formValues, data, basePath, (payload) => setState({ type: 'state', payload: payload }));
                    }}
                    onCancel={() => setOpen(false)}
                /> : null
            }
            {
                state.submitted ?
                    <Modal
                        isOpen
                        variant={ModalVariant.large}
                        showClose={false}
                        hasNoBodyWrapper
                        aria-describedby="wiz-modal-description"
                        aria-labelledby="wiz-modal-title"
                    >
                        <Wizard
                            title={'Remediate with Ansible'}
                            description={'Add actions to an Ansible Playbook'}
                            steps={[
                                {
                                    name: 'progress',
                                    component: <Progress
                                        onClose={() => {
                                            setState({ type: 'state', payload: { submitted: false, id: undefined, failed: false, formValues: undefined } });
                                        }}
                                        title={'Adding items to the playbook'}
                                        setOpen={setOpen}
                                        submitRemediation={() => submitRemediation(
                                            state.formValues,
                                            data,
                                            basePath,
                                            (payload) => setState({ type: 'state', payload: payload })
                                        )}
                                        setState={(payload) => setState({ type: 'state', payload: payload })}
                                        state={state}
                                    />,
                                    isFinishedStep: true
                                }
                            ]}
                            onClose={() => {
                                setState({ type: 'state', payload: { submitted: false, id: undefined, failed: false, formValues: undefined } });
                                setOpen(false);
                            }}
                        />
                    </Modal>
                    : null
            }
        </Fragment>
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
    registry: propTypes.shape({
        register: propTypes.func
    }).isRequired
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
