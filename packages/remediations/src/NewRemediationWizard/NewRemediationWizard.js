import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import keyBy from 'lodash/keyBy';
import transform from 'lodash/transform';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';
import schemaBuilder from './schema';
import * as api from '../api';
import Wizard from '@data-driven-forms/pf4-component-mapper/dist/esm/wizard';
import TextField from '@data-driven-forms/pf4-component-mapper/dist/esm/text-field';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/esm/component-types';
import SelectPlaybook from '../newSteps/selectPlaybook';
import ReviewActions from '../newSteps/reviewActions';
import IssueResolution from '../newSteps/issueResolution';
import FetchError from '../newSteps/fetchError';
import Review from '../newSteps/review';
import ReviewSystems from '../steps/reviewSystems';
import {
    submitRemediation,
    HAS_MULTIPLES,
    SELECTED_RESOLUTIONS,
    EXISTING_PLAYBOOK_SELECTED,
    MANUAL_RESOLUTION
} from '../utils';

const RemediationWizard = ({
    setOpen,
    data,
    basePath
}) => {

    const [ state, setState ] = useState({ errors: [] });

    const getIssuesMultiple = (issuesById, resolutions) =>
        data.issues.map(issue => {
            const issueResolutions = resolutions.find(r => r.id === issue.id).resolutions;
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

            const [ resolutions, errors ] = transform(result, ([ resolutions, errors ], value, key) => {
                if (!value) {
                    errors.push(`Issue ${key} does not have Ansible support`);
                } else {
                    resolutions.push(value);
                }

                return [ resolutions, errors ];
            }, [ [], [] ]);

            return { resolutions, errors };
        } catch (e) {
            return { errors: [ 'Error obtaining resolution information. Please try again later.' ] };
        }
    };

    useEffect(() => {
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
    }, []);

    const mapperExtension = {
        'select-playbook': {
            component: state.errors.length > 0 ? FetchError : SelectPlaybook,
            issues: data.issues,
            systems: data.systems
        },
        'review-systems': {
            component: ReviewSystems,
            issues: data.issues,
            systems: data.systems
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

    return (
        state.isLoaded ?
            <FormRenderer
                schema={state.schema}
                subscription={{ values: true }}
                FormTemplate={(props) => <Pf4FormTemplate {...props} showFormControls={false} />}
                initialValues={{
                    [HAS_MULTIPLES]: !!state.resolutions?.find(r => r.resolutions.length > 1),
                    [MANUAL_RESOLUTION]: true,
                    [SELECTED_RESOLUTIONS]: {},
                    [EXISTING_PLAYBOOK_SELECTED]: false
                }}
                componentMapper={{
                    [componentTypes.WIZARD]: Wizard,
                    [componentTypes.TEXT_FIELD]: TextField,
                    ...mapperExtension
                }}
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
    basePath: propTypes.string
};

export default RemediationWizard;
