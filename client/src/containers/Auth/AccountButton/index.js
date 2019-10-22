import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Menu, Dropdown } from "antd";
import { FaUserCircle, FaSignOutAlt, FaCogs } from "react-icons/fa";
import { signoutUser } from "actions/Auth";
import { MenuButton, MenuItemContainer, MenuItemTitle } from "components/Body";

const MenuItem = Menu.Item;

export const AccountButton = ({ firstName, lastName, push, signoutUser }) => {
	const options = (
		<Menu style={{ padding: 0 }}>
			<MenuItem>
				<MenuButton onClick={() => push("/employee/settings")}>
					<MenuItemContainer>
						<FaCogs />
						<MenuItemTitle>Settings</MenuItemTitle>
					</MenuItemContainer>
				</MenuButton>
			</MenuItem>
			<MenuItem>
				<MenuButton onClick={signoutUser}>
					<MenuItemContainer>
						<FaSignOutAlt />
						<MenuItemTitle>Logout</MenuItemTitle>
					</MenuItemContainer>
				</MenuButton>
			</MenuItem>
		</Menu>
	);

	return (
		<Dropdown overlay={options} trigger={["click"]} placement="bottomRight">
			<MenuButton hoverable style={{ padding: "0 20px", marginRight: 0 }}>
				<FaUserCircle style={{ position: "relative", top: 3 }} />
				<MenuItemTitle>
					{firstName} {lastName}
				</MenuItemTitle>
			</MenuButton>
		</Dropdown>
	);
};

AccountButton.propTypes = {
	firstName: PropTypes.string.isRequired,
	lastName: PropTypes.string.isRequired,
	push: PropTypes.func,
	signoutUser: PropTypes.func.isRequired,
};

export default connect(
	null,
	{ signoutUser },
)(AccountButton);
