import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { detailSelect } from './redux/actions';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/esm/RouterParams';
import { Tabs, Tab } from '@patternfly/react-core';

class ApplicationDetails extends Component {
    constructor(props) {
        super(props);
    }

    onTabClick = (_event, item) => {
        const { history, match: { url }, onDetailSelect, items, appList } = this.props;
        const applications = appList || items;
        const activeItem = applications.find(oneApp => oneApp.name === item);
        history.push(`${url}/${activeItem.name}`);
        onDetailSelect && onDetailSelect(activeItem.name);
    }

    render() {
        const { activeApp, items, appList } = this.props;
        const defaultApp = (activeApp && activeApp.appName) ||
            appList?.find(({ pageId, name }) => items?.[0]?.name === (pageId || name))?.name ||
            items?.[0]?.name;
        const applications = appList || items;
        return (
            <React.Fragment>
                {
                    applications && applications.length > 1 &&
                    <Tabs
                        activeKey={ defaultApp }
                        onSelect={ this.onTabClick }
                        isFilled
                        className="ins-c-inventory-detail__app-tabs"
                    >
                        { applications.map((item, key) => (
                            <Tab key={ key } eventKey={ item.name } title={ item.title }></Tab>
                        )) }
                    </Tabs>
                }
            </React.Fragment>
        );
    }
}

ApplicationDetails.propTypes = {
    history: PropTypes.any,
    match: PropTypes.any,
    items: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        title: PropTypes.string
    })),
    appList: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        title: PropTypes.string
    })),
    activeApp: PropTypes.shape({
        name: PropTypes.string
    }),
    onDetailSelect: PropTypes.func
};

ApplicationDetails.defaultProps = {
    activeApp: {}
};

function stateToProps({ entityDetails: { activeApps, activeApp } }) {
    return {
        items: activeApps,
        activeApp
    };
}

function propsToDispatch(dispatch) {
    return {
        onDetailSelect: (application) => {
            dispatch(detailSelect(application));
        }
    };
}

export default routerParams(connect(stateToProps, propsToDispatch)(ApplicationDetails));
