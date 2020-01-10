import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, FormGroup, Grid, GridItem, Bullseye } from '@patternfly/react-core';
import { ServerIcon } from '@patternfly/react-icons';

class CardSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValues: this.props.input.value ? this.props.input.value : this.isMulti ? [] : undefined
        };
    }

    isMulti = this.props.isMulti || this.props.multi;

    isDisabled = this.props.isDisabled || this.props.isReadOnly;

    change = () => this.props.input.onChange(this.state.selectedValues);

    handleMulti = (value) => this.state.selectedValues.includes(value) ?
        this.setState(({ selectedValues }) => ({ selectedValues: selectedValues.filter(valueSelect => valueSelect !== value) }), this.change)
        : this.setState(({ selectedValues }) => ({ selectedValues: [ ...selectedValues, value ] }), this.change);

    handleSingle = (value) => this.setState(() => ({ selectedValues: this.state.selectedValues === value ? undefined : value }), this.change);

    handleClick = (value) => {this.isMulti ? this.handleMulti(value) : this.handleSingle(value);}

    handleCompare = (value) => this.isMulti ? this.state.selectedValues.includes(value) : this.state.selectedValues === value;

    onClick = value => {
        if (this.isDisabled) {
            return undefined;
        }

        this.handleClick(value);
        this.props.input.onBlur();
    }

    handleKeyPress = (event, value) => {
        const spaceBar = 32;
        if (event.charCode === spaceBar) {
            event.preventDefault();
            this.onClick(value);
        }
    }

    prepareCards = () => this.props.options.map(option => this.props.mutator(option, this.props.formOptions)).map(({ value, label, isDisabled }) => {
        const { iconMapper, DefaultIcon } = this.props;

        const disabled = isDisabled || this.isDisabled;

        if (!value) {
            return undefined;
        }

        const Component = iconMapper(value, DefaultIcon);

        return (
            <GridItem sm={ 6 } md={ 4 } key={ value }>
                <Card
                    className={ `ins-c-sources__wizard--card${this.handleCompare(value) ? ' selected' : ''}${disabled ? ' disabled' : ''}` }
                    onClick={ () => this.onClick(value) }
                    tabIndex={ disabled ? -1 : 0 }
                    onKeyPress={ (e) => this.handleKeyPress(e, value) }
                    isHoverable={ !disabled }
                    isCompact={ true }
                >
                    <div className={ disabled ? 'disabled' : '' }>
                        <CardHeader className={Component ? 'text-elipsis' : '' }>
                            { label }
                        </CardHeader>
                        <CardBody>
                            <Bullseye>
                                {Component && <Component size="xl"/>}
                            </Bullseye>
                        </CardBody>
                    </div>
                </Card>
            </GridItem>
        );
    })

    render() {
        const { isRequired, label, helperText, hideLabel, meta, input } = this.props;
        const { error, touched } = meta;
        const showError = touched && error;

        return (
            <FormGroup
                isRequired={ isRequired }
                label={ !hideLabel && label }
                fieldId={ input.name }
                isValid={ !showError }
                helperText={ helperText }
                helperTextInvalid={ error }
            >
                <Grid gutter="md">
                    { this.prepareCards() }
                </Grid>
                <br />
            </FormGroup>
        );
    }
}

CardSelect.propTypes = {
    multi: PropTypes.bool,
    isMulti: PropTypes.bool,
    label: PropTypes.string,
    isRequired: PropTypes.bool,
    helperText: PropTypes.string,
    meta: PropTypes.object.isRequired,
    description: PropTypes.string,
    hideLabel: PropTypes.bool,
    name: PropTypes.string.isRequired,
    mutator: PropTypes.func,
    formOptions: PropTypes.any,
    FieldProvider: PropTypes.oneOfType([ PropTypes.node, PropTypes.func ]),
    options: PropTypes.array,
    input: PropTypes.shape({
        value: PropTypes.any,
        onChange: PropTypes.func,
        onBlur: PropTypes.func
    }).isRequired,
    DefaultIcon: PropTypes.oneOfType([ PropTypes.node, PropTypes.func, PropTypes.element ]),
    iconMapper: PropTypes.func,
    isDisabled: PropTypes.bool,
    isReadOnly: PropTypes.bool
};

CardSelect.defaultProps = {
    options: [],
    DefaultIcon: ServerIcon,
    iconMapper: (_value, DefaultIcon) => DefaultIcon,
    mutator: x => x
};

const CardSelectProvider = ({ FieldProvider, ...rest }) =>
    (
        <FieldProvider { ...rest }>
            { (props) =>  <CardSelect  { ...props } name={ props.input.name }/> }
        </FieldProvider>
    );

export default CardSelectProvider;
