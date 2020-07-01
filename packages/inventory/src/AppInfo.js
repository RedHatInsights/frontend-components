import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/components/esm/Skeleton';

class AppInfo extends Component {
    render () {
        const { activeApps, appList, active, loaded, componentMapper, entity, store } = this.props;
        const activeApp = (appList || activeApps).find(item => item.name === active.appName) || activeApps[0];
        const Component = componentMapper;
        return (
            <Fragment>
                { activeApp && <div className={ `ins-active-app-${activeApp.name}` }>
                    { Component ?
                        <Component
                            store={store}
                            inventoryId={entity.id}
                            appName={activeApp?.name}
                        />
                        : 'missing component'
                    }
                </div> }
                { !loaded && <Skeleton size={ SkeletonSize.md } /> }
            </Fragment>
        );
    }
}

AppInfo.propTypes = {
    store: PropTypes.any,
    entity: PropTypes.shape({
        id: PropTypes.string
    }),
    componentMapper: PropTypes.elementType,
    activeApps: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string
    })),
    appList: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        title: PropTypes.string
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

export default connect(({ entityDetails: { activeApps, activeApp, loaded, entity } }) => ({
    activeApps,
    active: activeApp,
    loaded,
    entity
}))(AppInfo);
