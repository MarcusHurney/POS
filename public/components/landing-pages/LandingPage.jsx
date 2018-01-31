import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { loginUser, authError } from 'Actions';

class LandingPage extends Component {
  componentWillMount() {
    // if the user is authenticated (has JWT in localStorage)
    // then push to '/userProfile' route.
    if (this.props.authenticated) {
      browserHistory.push(`/userProfile`);
    }
  }

  loginDemoUser() {
    const { loginUser, authError } = this.props;

    loginUser({
      email: 'demo@email.com',
      password: 'demopass'
    })
      .then(() => {
        if (this.props.authenticated) {
          browserHistory.push('/inventory');
        }
      })
      .catch(() => {
        authError('Could not login demo user at this time');
      });
  }

  render() {
    return (
      <div id="landingPage">
        <div className="features">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-lg-offset-3 col-md-offset-3">
                <h1>Point of Sale</h1>
                <p className="lightOrange">
                  This app was built for pharmacies in Vietnam and Indonesia.
                  Its purpose is to help pharmacies manage their inventories and
                  sales digitally instead of using pen and paper.
                </p>
              </div>

              <div className="col-xs-12">
                <div id="button_container">
                  <i
                    className="fa fa-arrow-right fa-2x wow bounceInLeft"
                    data-wow-delay="1s"
                    aria-hidden="true"
                  />
                  <button id="demoBtn" onClick={this.loginDemoUser.bind(this)}>
                    Live Demo
                  </button>
                  <i
                    className="fa fa-arrow-left fa-2x wow bounceInRight"
                    data-wow-delay="1s"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-4 col-md-4 wow bounceInLeft features-content">
                <i className="fa fa-user-md fa-3x lightPurple" />
                <h4 className="lightOrange">Add Employees</h4>
                <p>
                  Employees can create their own sub-profiles and login. Their
                  sales will be tracked live and justified with store wide data.
                </p>

                <i className="fa fa-tags fa-3x turqoise" />
                <h4 className="lightOrange">Add Products</h4>
                <p>
                  Add products to your inventory to lay the foundation of an
                  organized pharmacy.
                </p>

                <i className="fa fa fa-exchange fa-3x slateGray" />
                <h4 className="lightOrange">Make Sales</h4>
                <p>
                  Immediately begin making sales after login through the user
                  friendly sell page.
                </p>
              </div>

              <div
                className="col-lg-4 col-md-4 wow fadeIn"
                data-wow-delay="0.2s"
                align="center"
              >
                <img
                  className="img-responsive"
                  src="../../images/spilled_bottle.png"
                />
              </div>

              <div className="col-lg-4 col-md-4 wow bounceInRight features-content">
                <i className="fa fa-calculator fa-3x secondaryBlue" />
                <h4 className="lightOrange">Manage Inventory</h4>
                <p>
                  All products have a category which can be used to filter
                  search results and easily locate a product's data.
                </p>

                <i className="fa fa-line-chart fa-3x indianRed" />
                <h4 className="lightOrange">Track Sales</h4>
                <p>
                  Track revenue data by day, week, and month in the reporting
                  section. See which items are the top 10 sellers of the day,
                  week, and month. Beautiful charts make sales data come alive.
                </p>

                <i className="fa fa-money fa-3x limeGreen" />
                <h4 className="lightOrange">Maximize Profits</h4>
                <p>
                  Streamline inventory management and sales data to maximize
                  profits and eliminate headaches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { authenticated: state.user.authenticated };
}

export default connect(mapStateToProps, { loginUser, authError })(LandingPage);
