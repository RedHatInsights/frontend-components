import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@patternfly/react-core';
import { loadEntity } from './redux/actions';
import { Link, generatePath } from 'react-router-dom';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/esm/RouterParams';
import Entitydetail from './EntityDetail';
import PropTypes from 'prop-types';
import './InventoryDetail.scss';

class InventoryDetail extends React.Component {
    componentDidMount() {
        const { match: { params: { inventoryId } }, entity, loaded } = this.props;
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
        const {
            root,
            match: { params },
            useCard,
            hideBack,
            actions,
            showTags,
            hideInvLink,
            showDelete,
            appList
        } = this.props;
        return (
            <React.Fragment>
                <Entitydetail
                    useCard={ useCard }
                    actions={ actions }
                    showTags={ showTags }
                    hideInvLink={ hideInvLink }
                    showDelete={ showDelete }
                    appList={ appList }
                />
                { !hideBack && <Link to={ generatePath(root, params) }>
                    <Button variant='primary'>Back</Button>
                </Link> }
            </React.Fragment>
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
    })),
    appList: PropTypes.any
};

function mapDispatchToProps(dispatch, { showTags }) {
    return {
        loadEntity: (id, config) => dispatch(loadEntity(id, config, { showTags }))
    };
}

export default routerParams(connect(({ entityDetails: { entity, loaded } }) => ({ entity, loaded }), mapDispatchToProps)(InventoryDetail));
