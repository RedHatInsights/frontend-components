import React, { useEffect, useState }/*, { useContext }*/ from 'react';
import {
    Title,
    Button,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    EmptyStateBody,
    EmptyStateSecondaryActions,
    ListItem,
    List
} from '@patternfly/react-core';
import ProgressBar from '../common/ProgressBar';
//import { AddRoleWizardContext } from './add-role-wizard';
import PropTypes from 'prop-types';
import { InProgressIcon } from '@patternfly/react-icons';
import './progress.scss';

const EmtpyStateWithErrors = ({ errors }) => (
    (errors && Array.isArray(errors) && errors.length > 0) ? (
        <EmptyStateBody className='wizard-failed-errors'>
            <List>
                {
                    errors.map((error) => (
                        <ListItem key={ error }>{ error }</ListItem>
                    ))
                }
            </List>
        </EmptyStateBody>
    ) : null
);

EmtpyStateWithErrors.propTypes = {
    errors: PropTypes.array
};

const Progress = ({ onClose, title, percent, failed }) => {
    const [ message, setMessage ] = useState('This may take tens of seconds.');
    const [ errors, setErrors ] = useState(null);

    //const { setHideForm } = useContext(AddRoleWizardContext);

    return (

        <EmptyState variant={EmptyStateVariant.large}>
            <EmptyStateIcon className="pf-u-mb-lg" icon={InProgressIcon} />
            <Title headingLevel="h1" size='lg'>
                {title}
            </Title>
            <EmptyStateBody>
                <ProgressBar
                    percent={percent}
                    failed={failed}
                />
            </EmptyStateBody>
            <EmptyStateBody className={failed && 'wizard-failed-message'}>
                { message }
            </EmptyStateBody>
            <EmtpyStateWithErrors error={ errors } />
            <EmptyStateSecondaryActions>
                {
                    (percent === 100 || failed) &&
                            <Button
                                variant={'primary'}
                                ouiaId="ReturnToAppButton"
                                onClick={() => null}>
                                { failed ? 'Back' : 'Return to application' }
                            </Button>
                }
            </EmptyStateSecondaryActions>
        </EmptyState>

    );
};

Progress.defaultProps = {
    failed: false
};

Progress.propTypes = {
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    percent: PropTypes.number.isRequired,
    failed: PropTypes.bool
};

export default Progress;
