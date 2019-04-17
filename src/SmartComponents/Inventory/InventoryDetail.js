import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@patternfly/react-core';
import { loadEntity } from '../../redux/actions/inventory';
import { Link, generatePath } from 'react-router-dom';
import routerParams from '../../Utilities/RouterParams';
import Entitydetail from './EntityDetail';
import PropTypes from 'prop-types';
import './InventoryDetail.scss';

class InventoryDetail extends React.Component {
    componentDidMount() {
        const { match: { params: { inventoryId }}, entity, loaded } = this.props;
        if (!entity || entity.id !== inventoryId || !loaded) {
            this.props.loadEntity(
                inventoryId,
                {
                    prefix: this.props.pathPrefix,
                    base: this.props.apiBase,
                    hasItems: true
                }
            );
        }
    }

    render() {
        const { root, match: { params }, useCard, hideBack } = this.props;
        return (
            <React.Fragment>
                <Entitydetail useCard={ useCard }/>
                { !hideBack && <Link to={ generatePath(root, params) }>
                    <Button variant='primary'>Back</Button>
                </Link> }
            </React.Fragment>
        );
    }
}

InventoryDetail.propTypes = {
    useCard: PropTypes.bool,
    hideBack: PropTypes.bool,
    root: PropTypes.string,
    match: PropTypes.any,
    pathPrefix: PropTypes.number,
    apiBase: PropTypes.string,
    entity: PropTypes.shape({
        id: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
    }),
    loaded: PropTypes.bool,
    loadEntity: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        loadEntity: (id, config) => dispatch(loadEntity(id, config))
    };
}

export default routerParams(connect(({ entityDetails: { entity, loaded }}) => ({ entity, loaded }), mapDispatchToProps)(InventoryDetail));
