/* eslint-disable camelcase */

import { Pagination } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React, { Component } from 'react';

class PaginationWrapper extends Component {
    state = {};

    shouldComponentUpdate(nextProps) {
        if (nextProps.meta === this.props.meta) {
            return false;
        }

        return true;
    }
    changePage = (_event, pageNumber) => this.setState({ ...this.state, page: pageNumber }, this.apply);

    setPageSize = (_event, perPage) => this.setState({ ...this.state, page_size: perPage, page: 1 }, this.apply);

    apply = () => {
        this.props.apply(this.state);
    };

    render() {
        const { meta } = this.props;
        const { page, total_items, page_size } = meta;
        return (
            <React.Fragment>
                <Pagination
                    page={ page || 1 }
                    itemCount={ total_items || 0 }
                    perPage={ page_size || 25 }
                    onSetPage={ this.changePage }
                    onPerPageSelect={ this.setPageSize }
                />
            </React.Fragment>
        );
    }
}

PaginationWrapper.propTypes = {
    apply: propTypes.func,
    meta: propTypes.object
};

export default PaginationWrapper;
