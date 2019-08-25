import React, { Component } from "react";
import PropTypes from "prop-types";
import { Layout } from "antd";
import { AppRoutes } from "routes";
import { LeftMenu, RightMenu, SideMenu } from "components/Navigation";

const Header = Layout.Header;
const Content = Layout.Content;

const TABS = [
	"dashboard",
	"events/create",
	"events/edit",
	"events/viewall",
	"forms/create",
	"forms/viewall",
	"members/authorizations/viewall",
	"members/create",
	"members/viewall",
	"schedule",
	"seasons/create",
	"seasons/viewall",
	"templates/create",
	"templates/viewall",
	"settings",
	"help",
	"contact",
];

const ROOTTABS = ["events", "forms", "members", "seasons", "templates"];

const selectedTab = path => TABS.filter(tab => path.indexOf(tab) >= 1);

const openedKey = path => {
	const opened = ROOTTABS.find(tab => path.includes(tab));

	return opened ? [opened] : [];
};

class App extends Component {
	constructor(props) {
		super(props);

		const {
			location: { pathname },
		} = props;

		this.state = {
			isCollapsed: false,
			openKeys: openedKey(pathname),
			storedKeys: openedKey(pathname),
			selectedKey: selectedTab(pathname),
		};
	}

	componentDidUpdate = (prevProps, prevState) => {
		const { pathname } = this.props.location;

		if (prevProps.location.pathname !== pathname) {
			this.setState(prevState => ({
				openKeys: !prevState.isCollapsed ? openedKey(pathname) : [],
				selectedKey: selectedTab(pathname),
				storedKeys: selectedTab(pathname),
			}));
		}

		if (
			prevState.isCollapsed !== this.state.isCollapsed &&
			!this.state.isCollapsed
		) {
			this.setState({
				openKeys: openedKey(pathname),
			});
		}
	};

	handleOpenMenuChange = openKeys => {
		const latestOpenKey = openKeys.find(
			key => this.state.openKeys.indexOf(key) === -1,
		);

		if (ROOTTABS.indexOf(latestOpenKey) === -1) {
			this.setState({ openKeys });
		} else {
			this.setState({
				openKeys: [latestOpenKey],
			});
		}
	};

	handleTabClick = ({ key }) => {
		this.setState(() => {
			this.props.push(`/employee/${key}`);
			const openKeys = ROOTTABS.find(tab => key.includes(tab));

			return {
				openKeys: openKeys ? [openKeys] : [],
				storedKeys: [openKeys],
			};
		});
	};

	toggleSideMenu = () =>
		this.setState(prevState => ({
			openKeys: [],
			isCollapsed: !prevState.isCollapsed,
		}));

	render = () => (
		<div id="app">
			<Layout>
				<SideMenu
					{...this.state}
					onHandleTabClick={this.handleTabClick}
					onHandleOpenMenuChange={this.handleOpenMenuChange}
				/>
				<Layout>
					<Header>
						<LeftMenu toggleSideMenu={this.toggleSideMenu} />
						<RightMenu {...this.props} />
					</Header>
					<Content>
						<AppRoutes {...this.props} />
					</Content>
				</Layout>
			</Layout>
		</div>
	);
}

App.propTypes = {
	firstName: PropTypes.string.isRequired,
	lastName: PropTypes.string.isRequired,
	location: PropTypes.shape({
		pathname: PropTypes.string,
	}),
	push: PropTypes.func.isRequired,
	match: PropTypes.shape({
		url: PropTypes.string,
	}).isRequired,
	role: PropTypes.string.isRequired,
};

export default App;
