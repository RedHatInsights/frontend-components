import React from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption, SelectGroup, SelectVariant } from '@patternfly/react-core';

class Typeahead extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false,
            selected: []
        };

        this.onToggle = isExpanded => {
            this.setState({ isExpanded });
        };
    
        this.onSelect = (event, selection) => {
            console.log(selection);
        };

        this.clearSelection = () => {
            this.setState({
                selected: [],
                isExpanded: false
            });
        };
    }

    render() {
        const data = Object.values(this.props.items)[0];

        const { isExpanded, selected } = this.state;
        const titleId = 'multi-typeahead-select-id';

        return (
            <Select
                variant={ SelectVariant.typeaheadMulti }
                aria-label="Select a state"
                onToggle={ this.onToggle }
                onSelect={ this.onSelect }
                onClear={ this.clearSelection }
                selections={ selected }
                isExpanded={ isExpanded }
                ariaLabelledBy={ titleId }
                placeholderText="Select a state"
            >
                { Object.entries(data).map(([ key, values ]) =>
                    <SelectGroup key={ key } label={ key } value={ values }>
                        { values.map(value =>
                            <SelectOption key={ value } value={ value } />
                        ) }
                    </SelectGroup>
                ) }
            </Select>
        );
    }
}

Typeahead.propTypes = {
    data: PropTypes.object
};

Typeahead.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([ PropTypes.string, PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.string
    }) ]),
    placeholder: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.node,
        id: PropTypes.string,
        isChecked: PropTypes.bool,
        onChange: PropTypes.func
    }))
};

export default Typeahead;
