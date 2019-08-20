import React from 'react';
import { components } from 'react-select';
import PropTypes from 'prop-types';
import { CheckIcon } from '@patternfly/react-icons';
import { Checkbox } from '@patternfly/react-core';

const Option = (props) => (
    <div
        className={`ins-c-select__menu--option ${props.isFocused ? 'focused' : ''}`}
    >
        {
            props.selectProps && props.selectProps && props.selectProps.isCheckbox &&
            <Checkbox
                isChecked={props.isSelected || (props.data && props.data.selected) || false}
                onChange={() => props.selectOption(props.data)}
                id={`${props.innerProps && props.innerProps.id}-checkbox`}
            />
        }
        <components.Option {...props} />
        {props.isSelected && (props.selectProps && !props.selectProps.isCheckbox) && <CheckIcon size="sm" />}
    </div>
);

Option.propTypes = {
    isFocused: PropTypes.bool,
    isSelected: PropTypes.bool,
    getStyles: PropTypes.func.isRequired,
    selectOption: PropTypes.func,
    cx: PropTypes.func.isRequired,
    data: PropTypes.shape({
        selected: PropTypes.bool
    }),
    innerProps: PropTypes.shape({
        id: PropTypes.string
    }),
    selectProps: PropTypes.shape({
        isCheckbox: PropTypes.bool
    })
};

Option.defaultProps = {
    isFocused: false,
    isSelected: false,
    selectOption: () => undefined,
    selectProps: {
        isCheckbox: false
    },
    innerProps: {
        id: 'some-classname'
    }
}

export default Option;
