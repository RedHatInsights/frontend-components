import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TabLayout } from '../../PresentationalComponents/TabLayout';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import AppInfo from './AppInfo';

class ApplicationDetails extends Component {
    constructor(props) {
        super(props);
        this.onTabClick = this.onTabClick.bind(this);
    }

    onTabClick(_event, item) {
        const { history, match: { url }} = this.props;
        history.push(`${url}/${item.name}`);
    }

    render() {
        const { match, activeApp, items } = this.props;
        return (
            <React.Fragment>
                {
                    items &&
          <TabLayout items={ items } onTabClick={ this.onTabClick } active={ activeApp && activeApp.appName }>
              <Switch>
                  <Route exact path={ `${match.path}/:detail` } component={ AppInfo } />
                  <Redirect to={ `${match.path}/overview` } />
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
    })
};

function stateToProps({ entityDetails: { activeApps, activeApp }}) {
    return {
        items: activeApps,
        activeApp
    };
}

export default withRouter(connect(stateToProps)(ApplicationDetails));
