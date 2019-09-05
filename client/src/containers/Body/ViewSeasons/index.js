import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Card } from "antd";
import { FaCalendarPlus } from "react-icons/fa";
import { Button, FormatDate, FlexEnd, Table } from "components/Body";
import { deleteSeason, fetchSeasons } from "actions/Seasons";

const title = "View Seasons";

const columns = [
	{ title: "Season Id", dataIndex: "seasonId", key: "seasonId" },
	{
		title: "Start Date",
		dataIndex: "startDate",
		key: "startDate",
		render: date => <FormatDate format="MM/DD/YYYY" date={date} />,
	},
	{
		title: "End Date",
		dataIndex: "endDate",
		key: "endDate",
		render: date => <FormatDate format="MM/DD/YYYY" date={date} />,
	},
	{ title: "Members", dataIndex: "members", key: "members" },
];

export const ViewSeasons = ({ data, deleteSeason, fetchSeasons, push }) => (
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
					onClick={() => push("/employee/seasons/create")}
				>
					<FaCalendarPlus style={{ position: "relative", top: 2 }} />
					&nbsp; New Season
				</Button>
			</FlexEnd>
			<Table
				columns={columns}
				data={data}
				deleteAction={deleteSeason}
				editLocation="seasons"
				fetchData={fetchSeasons}
				push={push}
			/>
		</Card>
	</Fragment>
);

ViewSeasons.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.any,
			members: PropTypes.number,
			seasonId: PropTypes.string,
			startDate: PropTypes.string,
			endDate: PropTypes.string,
		}),
	),
	deleteSeason: PropTypes.func,
	fetchSeasons: PropTypes.func.isRequired,
	push: PropTypes.func,
};

const mapStateToProps = state => ({
	data: state.seasons.data,
});

const mapDispatchToProps = {
	deleteSeason,
	fetchSeasons,
	push,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ViewSeasons);
