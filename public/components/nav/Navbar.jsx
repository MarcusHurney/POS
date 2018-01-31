import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import PreAuthNavTabs from './PreAuthNavTabs';
import PostAuthNavTabs from './PostAuthNavTabs';

const Navbar = ({ activeUser, activeEmployee }) => {
  return (
    <div className="navbar navbar-default navbar-fixed-top" role="navigation">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle"
            data-toggle="collapse"
            data-target=".navbar-collapse"
          >
            <span className="sr-only">Toggle Navigaton</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
          <Link className="logo-anchor" to="/">
            <img className="navbar-brand" src="../../images/store_logo.png" />{' '}
            <span className="logo-text">Point of Sale</span>
          </Link>
        </div>
        {activeUser ? (
          <PostAuthNavTabs
            activeUser={activeUser}
            activeEmployee={activeEmployee}
          />
        ) : (
          <PreAuthNavTabs />
        )}
      </div>
    </div>
  );
};

Navbar.propTypes = {
  activeUser: PropTypes.object,
  activeEmployee: PropTypes.object
};

export default Navbar;
