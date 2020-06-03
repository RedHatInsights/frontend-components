import React from 'react';
import { connect } from 'react-redux';
import { loadEntity } from '../../redux/actions';
import Entitydetail from './EntityDetail';
import PropTypes from 'prop-types';

class InventoryDetail extends React.Component {
    componentDidMount() {
        const { entity, loaded } = this.props;
        const inventoryId = location.pathname.split('/')[location.pathname.split('/').length - 1];
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
        const { useCard, actions, showTags, hideInvLink, showDelete } = this.props;

        return (
            <Entitydetail
                useCard={ useCard }
                actions={ actions }
                showTags={ showTags }
                hideInvLink={ hideInvLink }
                showDelete={ showDelete }
            />
        );
    }
}

InventoryDetail.propTypes = {
    hideInvLink: PropTypes.bool,
    useCard: PropTypes.bool,
    hideBack: PropTypes.bool,
    root: PropTypes.string,
    match: PropTypes.any,
    pathPrefix: PropTypes.number,
    apiBase: PropTypes.string,
    entity: PropTypes.shape({
        id: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
    }),
    showTags: PropTypes.bool,
    loaded: PropTypes.bool,
    showDelete: PropTypes.bool,
    loadEntity: PropTypes.func,
    actions: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.node,
        onClick: PropTypes.func,
        key: PropTypes.string
    }))
};

function mapDispatchToProps(dispatch, { showTags }) {
    return {
        loadEntity: (id, config) => dispatch(loadEntity(id, config, { showTags }))
    };
}

export default connect(({ entityDetails: { entity, loaded } }) => ({ entity, loaded }), mapDispatchToProps)(InventoryDetail);
