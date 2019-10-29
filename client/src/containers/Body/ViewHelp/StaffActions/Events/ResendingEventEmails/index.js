import React from "react";
import { FaShareSquare } from "react-icons/fa";
import { Button, InfoText, TextContainer } from "components/Body";
import { Link } from "components/Navigation";

const iconStyle = {
	position: "relative",
	top: 2,
};

const linkStyle = {
	margin: 0,
	padding: 0,
};

const btnStyle = {
	display: "inline-block",
};

const ResendingEventEmails = () => (
	<TextContainer>
		<InfoText>
			To resend event (games, promotionals, or misc.) email reminders, go to the{" "}
			<Link
				blue
				style={linkStyle}
				to="/employee/events/viewall"
				target="_blank"
			>
				View Events
			</Link>{" "}
			page and click on one of the
		</InfoText>
		&nbsp;
		<Button
			primary
			width="50px"
			padding="0px"
			marginRight="0px"
			style={btnStyle}
			onClick={null}
		>
			<FaShareSquare style={iconStyle} />
		</Button>
		&nbsp;
		<InfoText>
			(Send/Resend Mail) buttons located under the{" "}
			<strong>Table Actions</strong> column. If the event is within 48 hours,
			the email reminders will be sent out immediately.
		</InfoText>
	</TextContainer>
);

export default ResendingEventEmails;