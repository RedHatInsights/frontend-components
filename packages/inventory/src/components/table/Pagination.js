/* eslint-disable camelcase */
import React from 'react';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import PropTypes from 'prop-types';

/**
 * Bottom pagination used in table. It can remember what page user is on if user entered the page number in input.
 */
const FooterPagination = ({
    total,
    page,
    perPage,
    direction,
    isFull,
    hasAccess,
    paginationProps,
    onRefreshData,
    loaded
}) => {
    /**
     * Thi method sets new page and combines previous props to apply sort, filters etc.
     * @param {*} event html event to figure if target was input.
     * @param {*} page current page to change to.
     */
    const onSetPage = (_event, pageArg) => onRefreshData({ page: pageArg });

    /**
     * This method changes per page, it automatically sets page to first one.
     * It also applies previous sort, filters, etc.
     * @param {*} _event event is now not used.
     * @param {*} perPage new perPage set by user.
     */
    const onPerPageSelect = (_event, perPageArg) => onRefreshData({ page: 1, per_page: perPageArg });

    return (loaded || !hasAccess) ? (
        <Pagination
            { ...isFull && {
                variant: PaginationVariant.bottom
            } }
            isDisabled={!hasAccess}
            itemCount={ total }
            page={ page }
            perPage={ perPage }
            dropDirection={ direction }
            onSetPage={ onSetPage }
            onPerPageSelect={ onPerPageSelect }
            {...paginationProps}
        />
    ) : null;
};

FooterPagination.propTypes = {
    perPage: PropTypes.number,
    total: PropTypes.number,
    page: PropTypes.number,
    isFull: PropTypes.bool,
    hasAccess: PropTypes.bool,
    direction: PropTypes.string,
    paginationProps: PropTypes.object,
    loaded: PropTypes.bool,
    onRefreshData: PropTypes.func.isRequired
};

FooterPagination.defaultProps = {
    total: 0,
    isFull: false,
    direction: 'up',
    hasAccess: true
};

export default FooterPagination;
