import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TabLayout } from '../../PresentationalComponents/TabLayout';
import { Switch, Redirect } from 'react-router-dom';
import { detailSelect } from '../../redux/actions/inventory';
import routerParams from '../../Utilities/RouterParams';

class ApplicationDetails extends Component {
    constructor(props) {
        super(props);
    }

    onTabClick = (_event, item) => {
        const { history, match: { url }, onDetailSelect } = this.props;
        history.push(`${url}/${item.name}`);
        onDetailSelect && onDetailSelect(item.name);
    }

    render() {
        const { match: { path }, activeApp, items } = this.props;
        const defaultApp = (activeApp && activeApp.appName) || items && items[0] && items[0].name;
        return (
            <React.Fragment>
                {
                    items &&
                    <TabLayout items={ items }
                        onTabClick={ this.onTabClick }
                        active={ defaultApp }>
                        <Switch>
                            <Redirect to={ `${path}/${defaultApp}` }/>
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
