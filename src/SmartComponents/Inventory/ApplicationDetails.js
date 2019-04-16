import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { detailSelect } from '../../redux/actions/inventory';
import routerParams from '../../Utilities/RouterParams';
import { Tabs, Tab } from '@patternfly/react-core';

class ApplicationDetails extends Component {
    constructor(props) {
        super(props);
    }

    onTabClick = (_event, item) => {
        const { history, match: { url }, onDetailSelect, items } = this.props;
        const activeItem = items.find(oneApp => oneApp.name === item);
        history.push(`${url}/${activeItem.name}`);
        onDetailSelect && onDetailSelect(activeItem.name);
    }

    render() {
        const { activeApp, items } = this.props;
        const defaultApp = (activeApp && activeApp.appName) || items && items[0] && items[0].name;
        return (
            <React.Fragment>
                {
                    items &&
                    <Tabs
                        activeKey={ defaultApp }
                        onSelect={ this.onTabClick }
                        isFilled
                        className="ins-c-inventory-detail__app-tabs"
                    >
                        { items.map((item, key) => (
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
    activeApp: PropTypes.shape({
        name: PropTypes.string
    }),
    onDetailSelect: PropTypes.func
};

ApplicationDetails.defaultProps = {
    activeApp: {}
};

function stateToProps({ entityDetails: { activeApps, activeApp }}) {
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
