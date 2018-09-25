import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { detailSelect } from '../../redux/actions/inventory';

class AppInfo extends Component {
    componentDidMount() {
        const { match: { params }, onDetailSelect } = this.props;
        onDetailSelect(params.detail);
    }
    render () {
        const { match, activeApps } = this.props;
        const activeApp = activeApps.find(item => item.name === match.params.detail);
        return (
            <div>
                { activeApp.component ? <activeApp.component /> : 'missing component' }
            </div>
        );
    }
}

AppInfo.propTypes = {
    match: PropTypes.any,
    activeApps: PropTypes.shape({
        name: PropTypes.string
    }),
    onDetailSelect: PropTypes.func
};
AppInfo.defaultProps = {};

function propsToDispatch(dispatch) {
    return {
        onDetailSelect: (application) => dispatch(detailSelect(application))
    };
}

export default withRouter(connect(({ entityDetails: { activeApps }}) => ({ activeApps }), propsToDispatch)(AppInfo));
