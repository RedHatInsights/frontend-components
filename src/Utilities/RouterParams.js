import React from 'react';
import { withRouter, matchPath } from 'react-router-dom';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

export default function(Component) {
  class RouterParams extends React.Component {
    componentDidMount () {
        const { match: {params, path, url}, onPathChange, location } = this.props;
        if (matchPath(location.pathname, {path: url, exact: true})) {
          onPathChange && onPathChange({
            params,
            path
          });
        }
    }

    componentDidUpdate () {
        const { match: { params, path, url }, onPathChange, location, routerData } = this.props;
        if (!isEqual(params, routerData.params) || path !== routerData.path) {
            if (matchPath(location.pathname, { path: url, exact: true })) {
                onPathChange && onPathChange({
                    params,
                    path
                });
            }
        }
    }

    render () {
        const { onPathChange, ...props } = this.props;
        return <Component { ...props }/>;
    }
};
return withRouter(connect(({ routerData }) => ({ routerData }), (dispatch) => (
    {
      onPathChange: (data) => dispatch({
        type: '@@INSIGHTS-CORE/NAVIGATION',
        payload: data
      })
    }
  ))(RouterParams));
}
