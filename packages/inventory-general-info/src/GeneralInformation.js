import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Grid,
    GridItem,
    Modal
} from '@patternfly/react-core';
import { SortByDirection } from '@patternfly/react-table';

import { systemProfile } from './redux/actions';
import InfoTable from './InfoTable';
import OperatingSystemCard from './OperatingSystemCard';
import SystemCard from './SystemCard';
import BiosCard from './BiosCard';
import InfrastructureCard from './InfrastructureCard';
import ConfigurationCard from './ConfigurationCard';
import CollectionCard from './CollectionCard';

import './general-information.scss';

class GeneralInformation extends Component {
    state = {
        isModalOpen: false,
        modalTitle: ''
    };

    onSort = (_event, index, direction, customRows) => {
        const { rows } = this.state;
        const sorted = (customRows || rows).sort((a, b) => {
            const firstRow = a.cells || a;
            const secondRow = b.cells || b;
            const aSortBy = ('' + (firstRow[index].sortValue || firstRow[index])).toLocaleLowerCase();
            const bSortBy = ('' + (secondRow[index].sortValue || secondRow[index])).toLocaleLowerCase();
            return (aSortBy > bSortBy) ? -1 : 1;
        });
        this.setState({
            rows: direction === SortByDirection.asc ? sorted : sorted.reverse()
        });
    }

    handleModalToggle = (modalTitle = '', { cells, rows, expandable } = {}) => {
        rows && this.onSort(undefined, expandable ? 1 : 0, SortByDirection.asc, rows);
        this.setState(({ isModalOpen }) => ({
            isModalOpen: !isModalOpen,
            modalTitle,
            cells,
            expandable
        }));
    };

    componentDidMount() {
        this.props.loadSystemDetail && this.props.loadSystemDetail(this.props.entity.id);
    };

    render() {
        const { isModalOpen, modalTitle, cells, rows, expandable } = this.state;
        return (
            <Grid sm={ 12 } md={ 6 } gutter="md">
                <GridItem>
                    <SystemCard handleClick={ this.handleModalToggle } />
                </GridItem>
                <GridItem>
                    <OperatingSystemCard handleClick={ this.handleModalToggle } />
                </GridItem>
                <GridItem>
                    <BiosCard handleClick={ this.handleModalToggle } />
                </GridItem>
                <GridItem>
                    <InfrastructureCard handleClick={ this.handleModalToggle } />
                </GridItem>
                <GridItem>
                    <ConfigurationCard handleClick={ this.handleModalToggle } />
                </GridItem>
                <GridItem>
                    <CollectionCard handleClick={ this.handleModalToggle } />
                </GridItem>
                <Modal
                    width={ 'initial' }
                    title={ modalTitle || '' }
                    isOpen={ isModalOpen }
                    onClose={ () => this.handleModalToggle() }
                    className="ins-c-inventory__detail--dialog"
                >
                    <InfoTable
                        cells={ cells }
                        rows={ rows }
                        expandable={ expandable }
                        onSort={ this.onSort }
                    />
                </Modal>
            </Grid>
        );
    }
}

GeneralInformation.propTypes = {
    entity: PropTypes.shape({
        id: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
    }),
    loadSystemDetail: PropTypes.func
};
GeneralInformation.defaultProps = {
    entity: {}
};

const mapStateToProps = ({
    entityDetails: {
        entity
    }
}) => ({
    entity
});
const mapDispatchToProps = (dispatch) => ({
    loadSystemDetail: (itemId) => dispatch(systemProfile(itemId))
});

export default connect(mapStateToProps, mapDispatchToProps)(GeneralInformation);
