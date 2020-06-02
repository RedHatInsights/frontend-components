import React, { useRef, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { Wizard } from '@patternfly/react-core';

import SourcesFormRenderer from '../sourceFormRenderer/index';
import createSchema from './SourceAddSchema';
import { doLoadSourceTypes, doLoadApplicationTypes } from '../api/index';
import LoadingStep from './steps/LoadingStep';
import { WIZARD_DESCRIPTION, WIZARD_TITLE } from '../utilities/stringConstants';
import filterApps from '../utilities/filterApps';

const initialValues = {
    schema: {},
    sourceTypes: [],
    isLoading: true
};

const reducer = (state, { type, sourceTypes, applicationTypes, container, disableAppSelection }) => {
    switch (type) {
        case 'loaded':
            return {
                ...state,
                schema: createSchema(sourceTypes.filter(type => type.schema), applicationTypes.filter(filterApps), disableAppSelection, container),
                isLoading: false,
                sourceTypes
            };
    }
};

const SourceAddModal = ({
    sourceTypes,
    applicationTypes,
    disableAppSelection,
    isCancelling,
    onCancel,
    values,
    onSubmit
}) => {
    const [{ schema, sourceTypes: stateSourceTypes, isLoading }, dispatch ] = useReducer(reducer, initialValues);
    const isMounted = useRef(false);
    const container = useRef(document.createElement('div'));

    useEffect(() => {
        isMounted.current = true;

        const promises = [];
        if (!sourceTypes) {
            promises.push(doLoadSourceTypes());
        }

        if (!applicationTypes) {
            promises.push(doLoadApplicationTypes());
        }

        Promise.all(promises).then((data) => {
            const sourceTypesOut = data.find(types => types.hasOwnProperty('sourceTypes'));
            const applicationTypesOut = data.find(types => types.hasOwnProperty('applicationTypes'));

            if (isMounted.current) {
                dispatch({
                    type: 'loaded',
                    sourceTypes: sourceTypes || sourceTypesOut.sourceTypes,
                    applicationTypes: applicationTypes || applicationTypesOut.applicationTypes,
                    disableAppSelection,
                    container: container.current
                });
            }
        });

        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        container.current.hidden = isCancelling;
    }, [ isCancelling ]);

    if (isLoading) {
        return <Wizard
            isOpen={ true }
            onClose={ onCancel }
            title={WIZARD_TITLE}
            description={WIZARD_DESCRIPTION}
            steps={ [{
                name: 'Loading',
                component: <LoadingStep onClose={ () => onCancel() }/>,
                isFinishedStep: true
            }] }
        />;
    }

    return (
        <SourcesFormRenderer
            initialValues={ values }
            schema={ schema }
            onSubmit={ (values) => onSubmit(values, stateSourceTypes) }
            onCancel={ onCancel }
        />
    );
};

SourceAddModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    sourceTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        product_name: PropTypes.string.isRequired,
        schema: PropTypes.shape({
            authentication: PropTypes.array,
            endpoint: PropTypes.object
        })
    })),
    applicationTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        display_name: PropTypes.string.isRequired
    })),
    values: PropTypes.object,
    disableAppSelection: PropTypes.bool,
    isCancelling: PropTypes.bool
};

SourceAddModal.defaultProps = {
    values: {},
    disableAppSelection: false
};

export default SourceAddModal;
