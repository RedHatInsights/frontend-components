import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonVariant, TextInput } from '@patternfly/react-core';
import { AngleDoubleLeftIcon, AngleLeftIcon, AngleDoubleRightIcon, AngleRightIcon } from '@patternfly/react-icons';

const PaginationNav = ({
    lastPage,
    setPage,
    pageTitle,
    amountOfPages,
    page,
    onFirstPage,
    onLastPage,
    onPreviousPage,
    onNextPage,
    ...props
}) => {
    return <nav className="pf-c-pagination__nav" aria-label="Pagination" { ...props }>
        <Button variant={ ButtonVariant.plain }
            isDisabled={ page === 1 }
            aria-label="Go to first page"
            data-action="first-page"
            onClick={ event => {
                onFirstPage(event);
                setPage(event, 1);
            } }
        >
            <AngleDoubleLeftIcon />
        </Button>
        <Button variant={ ButtonVariant.plain }
            isDisabled={ page === 1 }
            aria-label="Go to previous page"
            data-action="previous-page"
            onClick={ event => {
                onPreviousPage(event, page - 1);
                setPage(event, page - 1);
            } }
        >
            <AngleLeftIcon />
        </Button>
        <div className="pf-c-pagination__nav-page-select" aria-label={ `Current page ${page} of ${lastPage}` }>
            <TextInput className="pf-c-form-control"
                aria-label="Current page"
                type="number"
                min="1"
                data-action="set-page"
                max={ amountOfPages }
                style={ { width: `${lastPage.toString().length}rem`, minWidth: '3rem' } }
                isReadOnly={ amountOfPages === 1 }
                value={ page }
                onChange={ (value, event) => {
                    setPage(event, value === '' ? NaN : Number(value)); } }
            />
            <span aria-hidden="true">of { lastPage } { pageTitle }</span>
        </div>
        <Button variant={ ButtonVariant.plain }
            isDisabled={ page === lastPage }
            aria-label="Go to next page"
            data-action="next-page"
            onClick={ event => {
                onNextPage(event, page + 1);
                setPage(event, page + 1);
            } }
        >
            <AngleRightIcon />
        </Button>
        <Button variant={ ButtonVariant.plain }
            isDisabled={ page === lastPage }
            aria-label="Go to last page"
            data-action="last-page"
            onClick={ event => {
                onLastPage(event);
                setPage(event, lastPage);
            } }
        >
            <AngleDoubleRightIcon />
        </Button>
    </nav>;
};

PaginationNav.propTypes = {
    lastPage: PropTypes.number,
    page: PropTypes.number,
    pageTitle: PropTypes.string,
    setPage: PropTypes.func,
    amountOfPages: PropTypes.number,
    onFirstPage: PropTypes.func,
    onLastPage: PropTypes.func,
    onPreviousPage: PropTypes.func,
    onNextPage: PropTypes.func
};

PaginationNav.defaultProps = {
    pageTitle: 'pages',
    onFirstPage: () => undefined,
    onLastPage: () => undefined,
    onPreviousPage: () => undefined,
    onNextPage: () => undefined
};

export default PaginationNav;
