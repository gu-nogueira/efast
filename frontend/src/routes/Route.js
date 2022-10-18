import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

// Layouts
import AuthLayout from '../layouts/auth';
import DefaultLayout from '../layouts/default';

import { store } from '../store';

function RouteWrapper({ component: Component, isPrivate, ...rest }) {
  const { signed } = store.getState().auth;

  if (!signed && isPrivate) {
    return <Redirect to="/" />;
  }

  if (signed && !isPrivate) {
    return <Redirect to="/deliveries" />;
  }

  const Layout = signed ? DefaultLayout : AuthLayout;

  return (
    <Route
      {...rest}
      render={(props) => (
        <Layout url={props.location.pathname}>
          <Component {...props} signed={signed} />
        </Layout>
      )}
    />
  );
}

/*
 *  propTypes definition
 */

RouteWrapper.propTypes = {
  isPrivate: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
};

/*
 *  defaultProps definition
 */

RouteWrapper.defaultProps = {
  isPrivate: false,
};

export default RouteWrapper;
