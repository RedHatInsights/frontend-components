import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';

class AppInfo extends Component {
    render () {
        const { activeApps, active, loaded } = this.props;
        const activeApp = activeApps.find(item => item.name === active.appName) || activeApps[0];
        return (
            <Fragment>
                { activeApp && <div className={ `ins-active-app-${activeApp.name}` }>
                    { activeApp.component ? <activeApp.component /> : 'missing component' }
                </div> }
                { !loaded && <Skeleton size={ SkeletonSize.md } /> }
            </Fragment>
        );
    }
}

AppInfo.propTypes = {
    activeApps: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string
    })),
    active: PropTypes.shape({
        appName: PropTypes.string
    }),
    loaded: PropTypes.bool
};
AppInfo.defaultProps = {
    activeApps: [],
    active: {}
};

export default connect(({ entityDetails: { activeApps, activeApp, loaded } }) => ({
    activeApps,
    active: activeApp,
    loaded
}))(AppInfo);
