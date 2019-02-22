import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BulletList } from 'react-content-loader';
import { CardBody, Card } from '@patternfly/react-core';

class AppInfo extends Component {
    render () {
        const { activeApps, active, loaded } = this.props;
        const activeApp = activeApps.find(item => item.name === active.appName) || activeApps[0];
        return (
            <Fragment>
                { activeApp && <div className={ `ins-active-app-${activeApp.name}` }>
                    { activeApp.component ? <activeApp.component /> : 'missing component' }
                </div> }
                { !loaded && <Card>
                    <CardBody>
                        <BulletList />
                    </CardBody>
                </Card> }
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

export default connect(({ entityDetails: { activeApps, activeApp, loaded }}) => ({
    activeApps,
    active: activeApp,
    loaded
}))(AppInfo);
