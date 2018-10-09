import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TabLayout } from '../../PresentationalComponents/TabLayout';
import { Switch, Route, Redirect } from 'react-router-dom';
import AppInfo from './AppInfo';
import { detailSelect } from '../../redux/actions/inventory';
import { routerParams } from '../../';

class ApplicationDetails extends Component {
    constructor(props) {
        super(props);
        this.onTabClick = this.onTabClick.bind(this);
    }

    onTabClick(_event, item) {
        const { history, match: { url }, onDetailSelect } = this.props;
        history.push(`${url}/${item.name}`);
        onDetailSelect && onDetailSelect(item.name);
    }

    render() {
        const { match: { path }, activeApp, items } = this.props;
        return (
            <React.Fragment>
                {
                    items &&
                    <TabLayout items={ items } onTabClick={ this.onTabClick } active={ activeApp && activeApp.appName }>
                        <Switch>
                            <Route exact path={ `${path}/:detail` } component={ AppInfo } />
                            <Redirect to={ `${path}/overview` }/>
                        </Switch>
                    </TabLayout>
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
    activeApp: {
        appName: 'overview'
    }
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
