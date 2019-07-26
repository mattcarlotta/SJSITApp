import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import Helmet from "react-helmet";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { Card, Icon, Tabs } from "antd";
import { FaUserCircle, FaChartBar, FaReply, FaClock } from "react-icons/fa";
import { fetchMember, fetchMembers, updateMemberStatus } from "actions/Members";
import { PaneBody, Spinner } from "components/Body";
import Profile from "./Profile";
import ExtraButtons from "./ExtraButtons";

const Pane = Tabs.TabPane;

const title = "Member Profile";

const profile = (
	<span>
		<Icon component={FaUserCircle} />
		Profile
	</span>
);

const analytics = (
	<span>
		<Icon component={FaChartBar} />
		Analytics
	</span>
);

const responses = (
	<span>
		<Icon component={FaReply} />
		Responses
	</span>
);

const scheduling = (
	<span>
		<Icon component={FaClock} />
		Schedule
	</span>
);

class ViewMemberProfile extends PureComponent {
	componentDidMount = () => {
		const { id } = this.props.match.params;

		this.props.fetchMember(id);
	};

	render = () => {
		const { push, viewMember, updateMemberStatus } = this.props;

		const { events, schedule, status } = viewMember;

		return (
			<Fragment>
				<Helmet title={title} />
				<Card
					style={{ minHeight: 800 }}
					extra={<ExtraButtons push={push} />}
					title={title}
				>
					{isEmpty(viewMember) ? (
						<Spinner />
					) : (
						<Tabs tabPosition="left">
							<Pane tab={profile} key="profile">
								<Profile
									viewMember={viewMember}
									push={push}
									updateMemberStatus={updateMemberStatus}
								/>
							</Pane>
							<Pane tab={analytics} key="analytics">
								<PaneBody>
									<p>Analytics: {status}</p>
								</PaneBody>
							</Pane>
							<Pane tab={responses} key="responses">
								<PaneBody>
									<p>Responses: {JSON.stringify(events)}</p>
								</PaneBody>
							</Pane>
							<Pane tab={scheduling} key="schedule">
								<PaneBody>
									<p>Schedule: {JSON.stringify(schedule)}</p>
								</PaneBody>
							</Pane>
						</Tabs>
					)}
				</Card>
			</Fragment>
		);
	};
}

ViewMemberProfile.propTypes = {
	fetchMember: PropTypes.func.isRequired,
	fetchMembers: PropTypes.func.isRequired,
	push: PropTypes.func.isRequired,
	viewMember: PropTypes.shape({
		_id: PropTypes.string,
		email: PropTypes.string,
		events: PropTypes.any,
		firstName: PropTypes.string,
		lastName: PropTypes.string,
		registered: PropTypes.string,
		role: PropTypes.string,
		schedule: PropTypes.any,
		status: PropTypes.string,
	}),
	updateMemberStatus: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	viewMember: state.members.viewMember,
});

const mapDispatchToProps = {
	fetchMember,
	fetchMembers,
	push,
	updateMemberStatus,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ViewMemberProfile);
