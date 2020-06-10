/* eslint-disable camelcase */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/components/esm/Skeleton';

class AppInfo extends Component {
    render () {
        const { activeApps, active, loaded, componentsMapper, store } = this.props;
        const activeApp = activeApps.find(item => item.name === active.appName) || activeApps[0];
        const Cmp = activeApp && activeApp.name ? componentsMapper[activeApp.name] : 'missing component';
        return (
            <Fragment>
                { activeApp && <div className={ `ins-active-app-${activeApp.name}` }>
                    { Cmp ? <Cmp store={store} /> : 'missing component'}
                </div> }
                { !loaded && <Skeleton size={ SkeletonSize.md } /> }
            </Fragment>
        );
    }
}

AppInfo.propTypes = {
    store: PropTypes.any,
    activeApps: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string
    })),
    active: PropTypes.shape({
        appName: PropTypes.string
    }),
    loaded: PropTypes.bool,
    componentsMapper: PropTypes.shape({
        [PropTypes.string]: PropTypes.component
    })
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
