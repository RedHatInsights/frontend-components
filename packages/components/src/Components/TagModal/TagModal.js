import React from 'react';
import PropTypes from 'prop-types';
import './tagModal.scss';
import { Modal } from '@patternfly/react-core';
import classNames from 'classnames';
import {
    Table,
    TableHeader,
    TableBody
} from '@patternfly/react-table';

export default class TagModal extends React.Component {
    render() {
        const {
            className,
            systemName,
            toggleModal,
            isOpen,
            rows,
            columns,
            children,
            tableProps,
            ...props
        } = this.props;
        return (
            <Modal
                {...props}
                className={classNames('ins-c-tag-modal', className)}
                isOpen={isOpen}
                title={`Tags for ${systemName}`}
                onClose={toggleModal}
                isFooterLeftAligned
            >
                {children}
                <Table
                    aria-label={`${systemName} tags`}
                    variant="compact"
                    className="ins-c-tag-modal__table"
                    cells={columns}
                    rows={rows}
                    { ...tableProps }
                >
                    <TableHeader />
                    <TableBody />
                </Table>
            </Modal>
        );
    }
}

TagModal.propTypes = {
    systemName: PropTypes.string,
    isOpen: PropTypes.bool,
    toggleModal: PropTypes.func,
    rows: PropTypes.array,
    columns: PropTypes.array,
    className: PropTypes.string,
    tableProps: PropTypes.shape({
        [PropTypes.string]: PropTypes.any
    })
};

TagModal.defaultProps = {
    isOpen: false,
    toggleModal: () => undefined,
    columns: [
        { title: 'Name' },
        { title: 'Tag Source' }
    ],
    rows: [],
    tableProps: {}
};
