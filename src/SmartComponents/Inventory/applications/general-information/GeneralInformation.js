import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Grid,
    GridItem,
    GutterSize,
    Modal,
    Button
} from '@patternfly/react-core';
import './general-information.scss';
import { systemProfile } from '../../../../redux/actions/inventory';
import InfoTable from './InfoTable';
import SubscriptionCard from './SubscriptionCard';
import SystemCard from './SystemCard';
import BiosCard from './BiosCard';
import InfrastructureCard from './InfrastructureCard';
import ConfigurationCard from './ConfigurationCard';
import CollectionCard from './CollectionCard';
import { SortByDirection } from '@patternfly/react-table';

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
            const aSortBy = (firstRow[index].sortValue || firstRow[index]).toLocaleLowerCase();
            const bSortBy = (secondRow[index].sortValue || secondRow[index]).toLocaleLowerCase();
            return (aSortBy > bSortBy) - (aSortBy < bSortBy);
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
        this.props.loadSystemDetail(this.props.entity.id);
    };

    render() {
        const { isModalOpen, modalTitle, cells, rows, expandable } = this.state;
        return (
            <Grid sm={ 12 } md={ 6 } gutter={ GutterSize.md }>
                <GridItem>
                    <SystemCard handleClick={ this.handleModalToggle } />
                </GridItem>
                <GridItem>
                    <SubscriptionCard handleClick={ this.handleModalToggle } />
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
    entity: {},
    loadSystemDetail: () => undefined
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
