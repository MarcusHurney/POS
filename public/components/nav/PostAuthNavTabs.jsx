import React, {PropTypes} from 'react';
import {Link} from 'react-router';

const PostAuthNavTabs = ({ activeUser, activeEmployee }) => {

  return (
    <div id="postAuthNavTabs" className="navbar-collapse collapse">
      <ul className="nav navbar-nav navbar-left visible-xs">
        <li><Link to="/"><i id="homeIcon" className="fa fa-home fa-2x" aria-hidden="true"></i>Home</Link></li>
        <li><Link to="/inventory"><i id="sellIcon" className="fa fa-tags fa-2x" aria-hidden="true"></i>Sell</Link></li>
        <li><Link to="/allProducts"><i id="inventoryIcon"className="fa fa-list-ul fa-2x" aria-hidden="true"></i>Products</Link></li>
        <li><Link to="/salesHistory"><i id="salesIcon"className="fa fa-money fa-2x" aria-hidden="true"></i>Sales Data</Link></li>
        <li><Link to="/reporting"><i id="reportingIcon" className="fa fa-area-chart fa-2x" aria-hidden="true"></i>Reporting</Link></li>
      </ul>
      <ul className="nav navbar-nav navbar-right">
  			<li>
          <Link id="userTab" to={`/userProfile`}>
            <i id="userIcon" className="fa fa-user fa-2x" aria-hidden="true"></i>
            {/* Check to see if there is an employee currently logged in (activeEmployee)
                If not, show the activeUser's profile */}
            {$.isEmptyObject(activeEmployee) ? activeUser.profile.name : activeEmployee.name}
          </Link>
        </li>
  			<li><Link id="signOutTab" to="/signout">Signout</Link></li>
  		</ul>
    </div>
  );
};

PostAuthNavTabs.propTypes = {
  activeUser: PropTypes.object,
  activeEmployee: PropTypes.object
};

export default PostAuthNavTabs;
