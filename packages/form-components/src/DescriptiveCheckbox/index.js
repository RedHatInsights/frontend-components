import React from 'react';
import { Checkbox } from '@patternfly/react-core';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './descriptiveCheckbox.scss';

// eslint-disable-next-line no-unused-vars
const DescriptiveCheckbox = ({ name, label, description, isDanger, FieldProvider, isGlobal, ...rest }) => {
    return (
        <FieldProvider name={ name } data={ {
            isClearable: true
        } } type="checkbox" { ...rest } render={ ({ input: { onChange, ...input } }) => (
            <Checkbox
                { ...input }
                isChecked={ input.checked }
                id={ `descriptive-checkbox-${name}` }
                onChange={ (...props) => {
                    const { formOptions } = rest;
                    if (isGlobal) {
                        formOptions.batch(() => {
                            formOptions.getRegisteredFields().forEach((field) => {
                                if (typeof formOptions.getFieldState(field).value === 'boolean') {
                                    formOptions.getFieldState(field).change(false);
                                }
                            });
                        });
                    } else {
                        formOptions.getFieldState('unsubscribe.from-all').change(false);
                    }

                    onChange(...props);
                } }
                data-type="descriptive-checkbox"
                className="pref-c-descriptive-checkbox"
                label={ <span className={ classNames(
                    'pref-c-checkbox-label',
                    { 'pref-c-checkbox-label-error': isDanger || isGlobal }
                ) }>{label}</span> }
                { ...description && { description: <span className="pref-c-checkbox-description">{description}</span> } }
            />
        ) }
        />
    );
};

DescriptiveCheckbox.propTypes = {
    FieldProvider: PropTypes.any,
    formOptions: PropTypes.any,
    name: PropTypes.string,
    label: PropTypes.string,
    description: PropTypes.string,
    isDanger: PropTypes.bool,
    isGlobal: PropTypes.bool
};

DescriptiveCheckbox.defaultProps = {
    name: '',
    label: '',
    isDanger: false
};

export default DescriptiveCheckbox;
