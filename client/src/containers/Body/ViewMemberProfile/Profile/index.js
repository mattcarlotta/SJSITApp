import React, { Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import {
	Button,
	DisplayStatus,
	Flex,
	FlexEnd,
	FlexStart,
	LightText,
	Line,
	PaneBody,
	Small,
	Title,
} from "components/Body";
import { EditMemberForm } from "containers/Forms";
import { FaBan, FaUserPlus } from "react-icons/fa";

const iconStyle = {
	position: "relative",
	top: 3,
};

const btnStyle = {
	marginTop: 4,
	marginLeft: 25,
	display: "inline-block",
	height: 40,
};

const Profile = ({ viewMember, updateMemberStatus }) => {
	const { _id, firstName, lastName, registered, status } = viewMember;

	const isActive = status === "active";

	return (
		<PaneBody>
			<Flex>
				<FlexStart>
					<Title style={{ fontSize: 36, margin: 0 }}>
						{firstName} {lastName}
					</Title>
				</FlexStart>
				<FlexEnd>
					<Button
						primary={!isActive}
						danger={isActive}
						width="130px"
						padding="0px"
						style={btnStyle}
						onClick={() => updateMemberStatus({ _id, status })}
					>
						{isActive ? (
							<Fragment>
								<FaBan style={iconStyle} /> Suspend
							</Fragment>
						) : (
							<Fragment>
								<FaUserPlus style={iconStyle} /> Activate
							</Fragment>
						)}
					</Button>
				</FlexEnd>
			</Flex>
			<LightText>
				Unique id: <Small>{_id}</Small>
			</LightText>
			<LightText>
				Account Status:{" "}
				<Small>
					<DisplayStatus status={status} />
					<span css="margin-left: 5px;">({status})</span>
				</Small>
			</LightText>
			<LightText>
				Registered: <Small>{moment(registered).format("MMMM Do, YYYY")}</Small>
			</LightText>
			<Line width="400px" />
			<EditMemberForm />
		</PaneBody>
	);
};

Profile.propTypes = {
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

export default Profile;
