import React, { component } from 'react';
import PropTypes from 'prop-types';
import { SortByDirection } from '@patternfly/react-table';

class SortBy extends component {
    render() {
        return (
            <div>Sort By</div>
        );
    }
}

SortBy.propTypes = {
    direction: PropTypes.oneOf(Object.values(SortByDirection))
};

export default SortBy;
