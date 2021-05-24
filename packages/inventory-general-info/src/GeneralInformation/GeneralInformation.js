import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Grid,
    GridItem,
    Modal
} from '@patternfly/react-core';
import { SortByDirection } from '@patternfly/react-table';

import { systemProfile } from '../redux/actions';
import InfoTable from '../InfoTable';
import OperatingSystemCard from '../OperatingSystemCard';
import SystemCard from '../SystemCard';
import BiosCard from '../BiosCard';
import InfrastructureCard from '../InfrastructureCard';
import ConfigurationCard from '../ConfigurationCard';
import CollectionCard from '../CollectionCard';
import { Provider } from 'react-redux';
import './general-information.scss';

class GeneralInformation extends Component {
    state = {
        isModalOpen: false,
        modalTitle: '',
        modalVariant: 'small'
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

    handleModalToggle = (modalTitle = '', { cells, rows, expandable, filters } = {}, modalVariant = 'small') => {
        rows && this.onSort(undefined, expandable ? 1 : 0, SortByDirection.asc, rows);
        this.setState(({ isModalOpen }) => ({
            isModalOpen: !isModalOpen,
            modalTitle,
            cells,
            expandable,
            filters,
            modalVariant
        }));
    };

    componentDidMount() {
        this.props.loadSystemDetail && this.props.loadSystemDetail(this.props.entity.id);
    };

    render() {
        const { isModalOpen, modalTitle, cells, rows, expandable, filters, modalVariant } = this.state;
        const {
            store,
            writePermissions,
            SystemCardWrapper,
            OperatingSystemCardWrapper,
            BiosCardWrapper,
            InfrastructureCardWrapper,
            ConfigurationCardWrapper,
            CollectionCardWrapper,
            children
        } = this.props;
        const Wrapper = store ? Provider : Fragment;
        return (
            <Wrapper {...(store && { store })}>
                <div className="ins-c-general-information">
                    <Grid sm={ 12 } md={ 6 } hasGutter>
                        {SystemCardWrapper && <GridItem>
                            <SystemCardWrapper handleClick={ this.handleModalToggle } writePermissions={writePermissions} />
                        </GridItem>}
                        {OperatingSystemCardWrapper && <GridItem>
                            <OperatingSystemCardWrapper handleClick={ this.handleModalToggle } />
                        </GridItem>}
                        {BiosCardWrapper && <GridItem>
                            <BiosCardWrapper handleClick={ this.handleModalToggle } />
                        </GridItem>}
                        {InfrastructureCardWrapper && <GridItem>
                            <InfrastructureCardWrapper handleClick={ this.handleModalToggle } />
                        </GridItem>}
                        {ConfigurationCardWrapper && <GridItem>
                            <ConfigurationCardWrapper handleClick={ this.handleModalToggle } />
                        </GridItem>}
                        {CollectionCardWrapper && <GridItem>
                            <CollectionCardWrapper handleClick={ this.handleModalToggle } />
                        </GridItem>}
                        {children}
                        <Modal
                            title={ modalTitle || '' }
                            aria-label={`${modalTitle || ''} modal`}
                            isOpen={ isModalOpen }
                            onClose={ () => this.handleModalToggle() }
                            className="ins-c-inventory__detail--dialog"
                            variant={ modalVariant }
                        >
                            <InfoTable
                                cells={ cells }
                                rows={ rows }
                                expandable={ expandable }
                                onSort={ this.onSort }
                                filters={ filters }
                            />
                        </Modal>
                    </Grid>
                </div>
            </Wrapper>
        );
    }
}

GeneralInformation.propTypes = {
    entity: PropTypes.shape({
        id: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
    }),
    loadSystemDetail: PropTypes.func,
    store: PropTypes.any,
    writePermissions: PropTypes.bool,
    SystemCardWrapper: PropTypes.oneOfType([ PropTypes.node, PropTypes.bool ]),
    OperatingSystemCardWrapper: PropTypes.oneOfType([ PropTypes.node, PropTypes.bool ]),
    BiosCardWrapper: PropTypes.oneOfType([ PropTypes.node, PropTypes.bool ]),
    InfrastructureCardWrapper: PropTypes.oneOfType([ PropTypes.node, PropTypes.bool ]),
    ConfigurationCardWrapper: PropTypes.oneOfType([ PropTypes.node, PropTypes.bool ]),
    CollectionCardWrapper: PropTypes.oneOfType([ PropTypes.node, PropTypes.bool ]),
    children: PropTypes.node
};
GeneralInformation.defaultProps = {
    entity: {},
    SystemCardWrapper: SystemCard,
    OperatingSystemCardWrapper: OperatingSystemCard,
    BiosCardWrapper: BiosCard,
    InfrastructureCardWrapper: InfrastructureCard,
    ConfigurationCardWrapper: ConfigurationCard,
    CollectionCardWrapper: CollectionCard
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
