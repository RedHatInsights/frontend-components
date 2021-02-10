import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Grid, GridItem, Tile } from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/esm/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/esm/use-form-api';

const handleKeyPress = (event, value, onClick) => {
    const spaceBar = 32;
    if (event.charCode === spaceBar) {
        event.preventDefault();
        onClick(value);
    }
};

const CardSelect = (originalProps) => {
    const { isRequired, label, helperText, hideLabel, meta, input, options, mutator, DefaultIcon, iconMapper, ...props } = useFieldApi(originalProps);
    const formOptions = useFormApi();
    const [ icons ] = useState(() => {
        const components = {};

        options.forEach(({ value }) => components[value] = iconMapper(value, DefaultIcon));

        return components;
    });

    const isMulti = props.isMulti || props.multi;
    const isDisabled = props.isDisabled || props.isReadOnly;
    const inputValue = input.value || [];

    const handleMulti = (value) => input.onChange(
        inputValue.includes(value) ? inputValue.filter(valueSelect => valueSelect !== value) : [ ...inputValue, value ]
    );

    const handleSingle = (value) => input.onChange(inputValue === value ? undefined : value);

    const handleClick = (value) => isMulti ? handleMulti(value) : handleSingle(value);

    const onClick = value => {
        if (isDisabled) {
            return undefined;
        }

        handleClick(value);
        input.onBlur();
    };

    const prepareCards = () => options.map(option => mutator(option, formOptions)).map(({ value, label, isDisabled: itemIsDisabled }) => {
        const disabled = itemIsDisabled || isDisabled;

        if (!value) {
            return undefined;
        }

        const Component = icons[value];

        return (
            <GridItem sm={ 6 } md={ 4 } key={ value }>
                <Tile
                    className={ `ins-c-sources__wizard--tile${disabled ? ' disabled' : ''}` }
                    onClick={ () => onClick(value) }
                    tabIndex={ disabled ? -1 : 0 }
                    onKeyPress={ (e) => handleKeyPress(e, value, onClick) }
                    isDisabled={ disabled }
                    title={label}
                    isStacked
                    isSelected={inputValue.includes(value)}
                    {...(Component && { icon: <Component /> })}

                />
            </GridItem>
        );
    });

    const { error, touched } = meta;
    const showError = touched && error;

    return (
        <FormGroup
            isRequired={ isRequired }
            label={ !hideLabel && label }
            fieldId={ input.name }
            helperText={ helperText }
            helperTextInvalid={ error }
            validated={showError ? 'error' : 'default'}
        >
            <Grid hasGutter className="pf-u-mb-md">
                { prepareCards() }
            </Grid>
        </FormGroup>
    );
};

CardSelect.propTypes = {
    multi: PropTypes.bool,
    isMulti: PropTypes.bool,
    label: PropTypes.node,
    isRequired: PropTypes.bool,
    helperText: PropTypes.node,
    description: PropTypes.node,
    hideLabel: PropTypes.bool,
    name: PropTypes.string.isRequired,
    mutator: PropTypes.func,
    options: PropTypes.array,
    DefaultIcon: PropTypes.oneOfType([ PropTypes.node, PropTypes.func, PropTypes.element ]),
    iconMapper: PropTypes.func,
    isDisabled: PropTypes.bool,
    isReadOnly: PropTypes.bool
};

CardSelect.defaultProps = {
    options: [],
    iconMapper: (_value, DefaultIcon) => DefaultIcon,
    mutator: x => x
};

export default CardSelect;
