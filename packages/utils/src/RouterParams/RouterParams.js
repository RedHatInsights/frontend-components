import React from 'react';
import PropTypes from 'prop-types';
import { matchPath, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

class RouterParams extends React.Component {
  componentDidMount() {
    const {
      match: { params, path, url },
      onPathChange,
      location,
    } = this.props;
    if (matchPath(location.pathname, { path: url, exact: true })) {
      onPathChange &&
        onPathChange({
          params,
          path,
        });
    }
  }

  componentDidUpdate() {
    const {
      match: { params, path, url },
      onPathChange,
      location,
      routerData,
    } = this.props;
    if (routerData && (!isEqual(params, routerData.params) || path !== routerData.path)) {
      if (matchPath(location.pathname, { path: url, exact: true })) {
        onPathChange &&
          onPathChange({
            params,
            path,
          });
      }
    }
  }

  render() {
    const { onPathChange, routerData, staticContext, Component, ...props } = this.props;
    return <Component {...props} />;
  }
}

RouterParams.propTypes = {
  match: PropTypes.shape({ params: PropTypes.object, path: PropTypes.string, url: PropTypes.string }).isRequired,
  onPathChange: PropTypes.func,
  location: PropTypes.shape({ pathname: PropTypes.string.isRequired }).isRequired,
  routerData: PropTypes.shape({
    params: PropTypes.object,
    path: PropTypes.string,
  }).isRequired,
  staticContext: PropTypes.any,
  Component: PropTypes.any,
};

const routerParams = (Component) =>
  withRouter(
    connect(
      ({ routerData }) => ({ routerData }),
      (dispatch) => ({
        onPathChange: (data) =>
          dispatch({
            type: '@@INSIGHTS-CORE/NAVIGATION',
            payload: data,
          }),
      })
    )((props) => <RouterParams {...props} Component={Component} />)
  );

export default routerParams;
