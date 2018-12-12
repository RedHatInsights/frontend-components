import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class AppInfo extends Component {
    render () {
        const { activeApps, active } = this.props;
        const activeApp = activeApps.find(item => item.name === active.appName) || activeApps[0];
        return (
            <div>
                { activeApp.component ? <activeApp.component /> : 'missing component' }
            </div>
        );
    }
}

AppInfo.propTypes = {
    activeApps: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string
    })),
    active: PropTypes.shape({
        appName: PropTypes.string
    })
};
AppInfo.defaultProps = {
    activeApps: [],
    active: {}
};

export default connect(({ entityDetails: { activeApps, activeApp }}) => ({
    activeApps,
    active: activeApp
}))(AppInfo);
