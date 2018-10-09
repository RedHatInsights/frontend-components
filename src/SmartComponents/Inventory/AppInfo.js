import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import routerParams from '../../Utilities/RouterParams';

class AppInfo extends Component {
    render () {
        const { match: { params: { detail }}, activeApps } = this.props;
        const activeApp = activeApps.find(item => item.name === detail);
        return (
            <div>
                { activeApp.component ? <activeApp.component /> : 'missing component' }
            </div>
        );
    }
}

AppInfo.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            detail: PropTypes.string
        })
    }),
    activeApps: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string
    }))
};
AppInfo.defaultProps = {};

export default routerParams(connect(({ entityDetails: { activeApps }}) => ({ activeApps }))(AppInfo));
