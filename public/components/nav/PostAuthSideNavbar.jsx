import React from 'react';
import { Link } from 'react-router';

const PostAuthSideNavbar = () => {
  return (
    <nav id="sideNavParent" className="side-nav-wrapper visible-sm visible-md visible-lg">
      <ul>
        <li>
          <Link to="/">
            <i id="homeIcon" className="fa fa-home fa-2x" aria-hidden="true"></i>
          </Link>
        </li>
        <li className="homeLabel">Home</li>
        <li>
          <Link to="/inventory">
            <i id="sellIcon" className="fa fa-tags fa-2x" aria-hidden="true"></i>
          </Link>
        </li>
        <li className="sellLabel">Sell</li>
        <li>
          <Link to="/allProducts">
            <i id="inventoryIcon" className="fa fa-list-ul fa-2x" aria-hidden="true"></i>
          </Link>
        </li>
        <li className="inventoryLabel">Inventory</li>
        <li>
          <Link to="/salesHistory">
            <i id="salesIcon" className="fa fa-money fa-2x" aria-hidden="true"></i>
          </Link>
        </li>
        <li className="salesLabel">Sales Data</li>
        <li>
          <Link to="/reporting">
            <i id="reportingIcon"className="fa fa-area-chart fa-2x" aria-hidden="true"></i>
          </Link>
        </li>
        <li className="reportingLabel">Reporting</li>
      </ul>
    </nav>
  );
};

export default PostAuthSideNavbar;
