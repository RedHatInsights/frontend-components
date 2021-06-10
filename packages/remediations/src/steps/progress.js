import React from 'react';
import {
    Title,
    Button,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    EmptyStateBody,
    EmptyStateSecondaryActions
} from '@patternfly/react-core';
import ProgressBar from '../common/ProgressBar';
import PropTypes from 'prop-types';
import { CheckCircleIcon, ExclamationCircleIcon, ExternalLinkSquareAltIcon, InProgressIcon } from '@patternfly/react-icons';
import { dedupeArray, getEnvUrl, pluralize, remediationUrl, SELECT_PLAYBOOK, SYSTEMS } from '../utils';
import './progress.scss';

const Progress = ({
    onClose,
    setOpen,
    submitRemediation,
    setState,
    state
}) => {
    const { percent, failed, systems, issues, playbook } = {
        percent: state.percent,
        failed: state.failed,
        systems: dedupeArray(Object.values(state.formValues[SYSTEMS]).flat()),
        issues: Object.keys(state.formValues[SYSTEMS]),
        playbook: {
            name: state.formValues[SELECT_PLAYBOOK],
            id: state.id
        }
    };

    return (
        <EmptyState variant={EmptyStateVariant.large}>
            <EmptyStateIcon
                className="pf-u-mb-lg pf-u-mt-sm"
                color={failed ? 'var(--pf-global--danger-color--100)' :
                    (percent === 100 ? 'var(--pf-global--success-color--100)' : undefined)}
                icon={failed ?
                    ExclamationCircleIcon :
                    (percent === 100 ? CheckCircleIcon : InProgressIcon)} />
            <Title headingLevel="h1" size='lg'>
                {failed ? 'Error: Unable to add items to playbook' :
                    (percent === 100 ? 'Items added to playbook' : 'Adding items to the playbook')}
            </Title>
            <EmptyStateBody className="pf-c-progress-bar pf-u-mt-md">
                <ProgressBar
                    percent={percent}
                    failed={failed}
                />
            </EmptyStateBody>
            {(failed || percent === 100) && <EmptyStateBody className="pf-c-progress-message">
                { failed ?
                    'Please try again.' :
                    <div>{`${issues.length} ${pluralize(issues.length, 'action')} affecting 
                        ${systems.length} ${pluralize(systems.length, 'system')} 
                        ${issues.length > 1 ? 'were' : 'was'} added to the playbook `}
                    <a href={remediationUrl(playbook.id)}>{playbook.name}</a>.
                    </div>
                }
            </EmptyStateBody>
            }
            {percent === 100 && <EmptyStateBody className="pf-c-progress-message-description pf-u-mb-md">
            You can remediate these systems directly from Insights by enabling
                <Button
                    variant="link"
                    className="pf-u-py-0 pf-u-px-xs"
                    icon={<ExternalLinkSquareAltIcon />}
                    iconPosition="right"
                    isSmall
                    onClick={
                        () => window.location.href = `${window.location.origin}/${getEnvUrl()}settings/connector`
                    }
                >
                Cloud Connector
                </Button>
            on eligible systems.
            </EmptyStateBody>
            }
            {
                failed &&
                    <Button
                        className="pf-u-mt-md pf-u-mb-sm"
                        variant="primary"
                        ouiaId="TryAgainButton"
                        onClick={() => {
                            setState({ failed: false, percent: 0 });
                            submitRemediation(false);
                        }}>
                        Try again
                    </Button>
            }
            {
                percent === 100 &&
                    <Button
                        className="pf-u-mt-md pf-u-mb-sm"
                        variant="primary"
                        ouiaId="ReturnToAppButton"
                        onClick={() => {
                            onClose();
                            setOpen(false);
                        }}>
                        Return to application
                    </Button>
            }
            <EmptyStateSecondaryActions>
                {
                    failed &&
                        <Button
                            variant="secondary"
                            ouiaId="BackToWizardButton"
                            onClick={() => {
                                onClose();
                            }}>
                            Go back to the wizard
                        </Button>
                }
                {
                    percent === 100 &&
                        <Button
                            variant="link"
                            ouiaId="OpenPlaybookButton"
                            onClick={() => {
                                onClose();
                                setOpen(false);
                                window.location.href = remediationUrl(playbook.id);
                            }}>
                            Open Playbook {playbook.name}
                        </Button>
                }
            </EmptyStateSecondaryActions>
        </EmptyState>
    );
};

Progress.propTypes = {
    onClose: PropTypes.func,
    setOpen: PropTypes.func,
    submitRemediation: PropTypes.func,
    setState: PropTypes.func,
    state: PropTypes.shape({
        id: PropTypes.number,
        percent: PropTypes.number.isRequired,
        failed: PropTypes.bool.isRequired,
        formValues: PropTypes.shape({
            [SELECT_PLAYBOOK]: PropTypes.string,
            [SYSTEMS]: PropTypes.objectOf(
                PropTypes.arrayOf(PropTypes.string)
            )
        })
    })
};

export default Progress;
