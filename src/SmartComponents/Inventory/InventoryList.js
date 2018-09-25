import React from 'react';
import { connect } from 'react-redux';
import InventoryEntityTable from './EntityTable';
import { Button } from '@patternfly/react-core';
import { loadEntities, filterEntities } from '../../redux/actions/inventory';
import { SimpleTableFilter } from '../../PresentationalComponents/SimpleTableFilter';
import { Grid, GridItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import './InventoryList.scss';

class InventoryList extends React.Component {
    constructor(props) {
        super(props);
        this.filterEntities = this.filterEntities.bind(this);
    }

    filterEntities(filterBy) {
        this.props.filterEntities && this.props.filterEntities('display_name', filterBy);
    }

    componentDidMount() {
        this.props.loadEntities();
    }

    render() {
        return (
            <React.Fragment>
                <Grid guttter="sm" className="ins-inventory-list">
                    <GridItem span={ 4 } className="ins-inventory-filter">
                        <SimpleTableFilter
                            onFilterChange={ this.filterEntities }
                            placeholder="Find system by hostname or UUID"
                            buttonTitle=""
                        />
                    </GridItem>
                    <GridItem span={ 12 }>
                        <InventoryEntityTable />
                    </GridItem>
                    <GridItem span={ 1 }>
                        <div className='buttons'>
                            <Button variant='primary' onClick={ this.props.entites }>Refresh</Button>
                        </div>
                    </GridItem>
                </Grid>
            </React.Fragment>
        );
    }
}

InventoryList.propTypes = {
    filterEntities: PropTypes.func,
    loadEntities: PropTypes.func,
    entites: PropTypes.arrayOf(PropTypes.any)
};

function mapDispatchToProps(dispatch) {
    return {
        loadEntities: () => dispatch(loadEntities()),
        filterEntities: (key = 'display_name', filterBy) => dispatch(filterEntities(key, filterBy))
    };
}

export default connect(() => ({}), mapDispatchToProps)(InventoryList);
