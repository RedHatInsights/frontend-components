import React from 'react';
import PropTypes from 'prop-types';
import { Wizard } from '@patternfly/react-core';

import SourcesFormRenderer from '../sourceFormRenderer/index';
import createSchema from './SourceAddSchema';
import { doLoadSourceTypes } from '../api/index';
import LoadingStep from './steps/LoadingStep';

const initialValues = {
    schema: {},
    sourceTypes: [],
    isLoading: true
};

class SourceAddModal extends React.Component {
    _isMounted = false;
    state = initialValues;

    componentDidMount() {
        this._isMounted = true;
        const { sourceTypes } = this.props;

        if (sourceTypes) {
            this.setState({ schema: createSchema(sourceTypes.filter(type => type.schema)), isLoading: false, sourceTypes });
        } else {
            doLoadSourceTypes().then(types => {
                if (this._isMounted) {
                    this.setState({ sourceTypes: types, schema: createSchema(types.filter(type => type.schema)), isLoading: false });
                }
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { onCancel, values, onSubmit } = this.props;
        const { schema, sourceTypes, isLoading } = this.state;

        if (isLoading) {
            return <Wizard
                isOpen={ true }
                onClose={ onCancel }
                title="Add a source"
                description="You are importing data into this platform"
                steps={ [{
                    name: 'Loading',
                    component: <LoadingStep onClose={ onCancel }/>,
                    isFinishedStep: true
                }] }
            />;
        }

        return (
            <SourcesFormRenderer
                initialValues={ values }
                schema={ schema }
                showFormControls={ false }
                onSubmit={ (values) => onSubmit(values, sourceTypes) }
                onCancel={ onCancel }
            />
        );
    }
}

SourceAddModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    sourceTypes: PropTypes.array,
    values: PropTypes.object
};

SourceAddModal.defaultProps = {
    values: {}
};

export default SourceAddModal;
