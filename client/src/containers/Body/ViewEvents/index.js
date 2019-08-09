import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Card } from "antd";
import { FaUserPlus } from "react-icons/fa";
import {
	Button,
	DisplayFullDate,
	DisplayLeague,
	DisplayTime,
	FlexEnd,
	Table,
} from "components/Body";
import { deleteEvent, fetchEvents } from "actions/Events";

const title = "View Events";

const columns = [
	{ title: "Season Id", dataIndex: "seasonId", key: "seasonId" },
	{
		title: "League",
		dataIndex: "league",
		key: "league",
		render: league => <DisplayLeague league={league} />,
	},
	{ title: "Event Type", dataIndex: "eventType", key: "eventType" },
	{ title: "Location", dataIndex: "location", key: "location" },
	{ title: "Uniform", dataIndex: "uniform", key: "uniform" },
	{
		title: "Event Date",
		dataIndex: "eventDate",
		key: "eventDate",
		width: 200,
		render: date => <DisplayFullDate date={date} />,
	},
	{
		title: "Call Times",
		dataIndex: "callTimes",
		key: "callTimes",
		width: 110,
		render: times => <DisplayTime times={times} />,
	},
	{
		title: "Employee Responses",
		dataIndex: "employeeResponses",
		key: "employeeResponses",
		width: 100,
	},
	{
		title: "Scheduled Employees",
		dataIndex: "scheduledEmployees",
		key: "scheduledEmployees",
		width: 100,
	},
];

export const ViewEvents = ({
	data,
	deleteEvent,
	fetchEvents,
	isLoading,
	push,
}) => (
	<Fragment>
		<Helmet title={title} />
		<Card title={title}>
			<FlexEnd>
				<Button
					primary
					width="180px"
					marginRight="0px"
					padding="5px 10px"
					style={{ marginBottom: 20 }}
					onClick={() => push("/employee/events/create")}
				>
					<FaUserPlus style={{ position: "relative", top: 2 }} />
					&nbsp; Add Event
				</Button>
			</FlexEnd>
			<Table
				columns={columns}
				data={data}
				deleteAction={deleteEvent}
				fetchData={fetchEvents}
				isLoading={isLoading}
				push={push}
				editLocation="event"
			/>
		</Card>
	</Fragment>
);

ViewEvents.propTypes = {
	deleteEvent: PropTypes.func,
	fetchEvents: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	push: PropTypes.func,
	data: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string,
			league: PropTypes.string,
			eventType: PropTypes.string,
			location: PropTypes.string,
			callTimes: PropTypes.arrayOf(PropTypes.string),
			uniform: PropTypes.string,
			seasonId: PropTypes.string,
			eventDate: PropTypes.string,
			employeeResponses: PropTypes.number,
			scheduledEmployees: PropTypes.number,
		}),
	),
};

const mapStateToProps = state => ({
	data: state.events.data,
	isLoading: state.events.isLoading,
});

const mapDispatchToProps = {
	deleteEvent,
	fetchEvents,
	push,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ViewEvents);