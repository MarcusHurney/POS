import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as actions from 'Actions';

class Signout extends Component {

	componentWillMount() {
		// Signs out user as soon as they hit this route
		// This strategy allows the use of a message to show the user before they leave
		this.props.signoutUser();
	}

	componentWillReceiveProps(nextProps) {
		// if the user logs in from this page, push onward to '/inventory'
		if (nextProps.authenticated) {
				browserHistory.push('/inventory');
		}
	}

	render() {
		return (
			<div id="signOutPage">
        <div id="signoutMessage">
          <h1>Goodbye!</h1>
        </div>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return { authenticated: state.user.authenticated };
}

export default connect(mapStateToProps, actions)(Signout);
