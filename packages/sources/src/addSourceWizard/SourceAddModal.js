import React from 'react';
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
    application: [],
    isLoading: true
};

class SourceAddModal extends React.Component {
    _isMounted = false;
    state = initialValues;
    container = document.createElement('div');

    componentDidMount() {
        this._isMounted = true;
        const { sourceTypes, applicationTypes, disableAppSelection } = this.props;

        if (sourceTypes && applicationTypes) {
            this.setState({
                schema: createSchema(sourceTypes.filter(type => type.schema), applicationTypes.filter(filterApps), disableAppSelection, this.container),
                isLoading: false,
                sourceTypes,
                applicationTypes
            });
        } else {
            const promises = [];
            if (!sourceTypes) {
                promises.push(doLoadSourceTypes());
            }

            if (!applicationTypes) {
                promises.push(doLoadApplicationTypes());
            }

            return Promise.all(promises).then((data) => {
                const sourceTypesOut = data.find(types => types.hasOwnProperty('sourceTypes'));
                const applicationTypesOut = data.find(types => types.hasOwnProperty('applicationTypes'));

                const sourceTypesFinal = sourceTypes || sourceTypesOut.sourceTypes;
                const applicationTypesFinal = applicationTypes || applicationTypesOut.applicationTypes;

                if (this._isMounted) {
                    this.setState({
                        sourceTypes: sourceTypesFinal,
                        schema: createSchema(
                            sourceTypesFinal.filter(type => type.schema),
                            applicationTypesFinal.filter(filterApps),
                            disableAppSelection,
                            this.container
                        ),
                        isLoading: false,
                        applicationTypes: applicationTypesFinal
                    });
                }
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(prevProps) {
        if (this.props.isCancelling !== prevProps.isCancelling) {
            this.container.hidden = this.props.isCancelling;
        }
    }

    render() {
        const { onCancel, values, onSubmit } = this.props;
        const { schema, sourceTypes, isLoading } = this.state;

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
                onSubmit={ (values) => onSubmit(values, sourceTypes) }
                onCancel={ onCancel }
            />
        );
    }
}

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
