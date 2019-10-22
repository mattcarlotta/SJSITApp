import React from "react";
import { Button, InfoText, TextContainer } from "components/Body";
import { Link } from "components/Navigation";

const linkStyle = {
	margin: 0,
	padding: 0,
};

const btnStyle = {
	display: "inline-block",
};

const ChangingName = () => (
	<TextContainer>
		<InfoText>To change your first and/or last name, go to the</InfoText>
		&nbsp;
		<Link blue style={linkStyle} to="/employee/settings">
			Settings
		</Link>
		&nbsp;
		<InfoText>
			page and update the <strong>First Name</strong> and/or{" "}
			<strong>Last Name</strong> field(s). Once finished, click the
		</InfoText>
		&nbsp;
		<Button
			primary
			width="165px"
			padding="0px"
			marginRight="0px"
			style={btnStyle}
			onClick={null}
		>
			Update Settings
		</Button>
		&nbsp;
		<InfoText>button to update and save your changes.</InfoText>
	</TextContainer>
);

export default ChangingName;
