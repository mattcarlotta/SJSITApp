import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { Card } from "antd";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { BackButton, FormContainer, SubmitButton } from "components/Body";
import {
	AddField,
	FieldGenerator,
	FormTitle,
	LoadingForm,
} from "components/Forms";
import { createEvent, initializeNewEvent } from "actions/Events";
import { fieldValidator, fieldUpdater, parseFields } from "utils";
import updateFormFields from "./UpdateFormFields";
import fields from "./Fields";

const title = "New Event Form";

export class NewEventForm extends Component {
	state = {
		fields,
		isLoading: true,
		isSubmitting: false,
	};

	static getDerivedStateFromProps = ({ newEvent, serverMessage }, state) => {
		if (state.isLoading && !isEmpty(newEvent)) {
			return {
				fields: state.fields.map(field => updateFormFields(field, newEvent)),
				isLoading: false,
			};
		}

		if (serverMessage) return { isSubmitting: false };

		return null;
	};

	componentDidMount = () => {
		this.props.initializeNewEvent();
	};

	handleAddField = () => {
		this.setState(prevState => ({
			...prevState,
			fields: [
				...prevState.fields,
				{
					type: "time",
					name: `callTime-${Date.now()}`,
					placeholder: "Select a call time...",
					label: "",
					value: null,
					errors: "",
					height: "auto",
					style: { width: "100%" },
					onFieldRemove: this.handleRemoveField,
				},
			],
		}));
	};

	handleRemoveField = name => {
		this.setState(prevState => ({
			...prevState,
			fields: prevState.fields.filter(field => field.name !== name),
		}));
	};

	handleChange = ({ target: { name, value } }) => {
		this.setState(prevState => ({
			...prevState,
			fields: fieldUpdater(prevState.fields, name, value),
		}));
	};

	handleSubmit = e => {
		e.preventDefault();
		const { validatedFields, errors } = fieldValidator(this.state.fields);

		this.setState({ fields: validatedFields, isSubmitting: !errors }, () => {
			const { fields: formFields } = this.state;

			if (!errors) {
				const parsedFields = parseFields(formFields);

				this.props.createEvent(parsedFields);
			}
		});
	};

	render = () => (
		<Card
			extra={
				<BackButton
					push={this.props.push}
					location="/employee/events/viewall"
				/>
			}
			title={title}
		>
			<FormContainer>
				<FormTitle
					header={title}
					title={title}
					description="Please fill out all of the event fields below."
				/>
				<form onSubmit={this.handleSubmit}>
					{this.state.isLoading ? (
						<LoadingForm rows={9} />
					) : (
						<Fragment>
							<FieldGenerator
								fields={this.state.fields}
								onChange={this.handleChange}
							/>
							<AddField
								onClick={this.handleAddField}
								text="Add Call Time Slot"
							/>
							<SubmitButton
								disabled={isEmpty(this.props.newEvent)}
								title="Create Event"
								isSubmitting={this.state.isSubmitting}
							/>
						</Fragment>
					)}
				</form>
			</FormContainer>
		</Card>
	);
}

NewEventForm.propTypes = {
	createEvent: PropTypes.func.isRequired,
	newEvent: PropTypes.shape({
		seasonIds: PropTypes.arrayOf(PropTypes.string),
		teams: PropTypes.arrayOf(PropTypes.string),
	}),
	initializeNewEvent: PropTypes.func.isRequired,
	push: PropTypes.func.isRequired,
	serverMessage: PropTypes.string,
};

const mapStateToProps = state => ({
	serverMessage: state.server.message,
	newEvent: state.events.newEvent,
});

const mapDispatchToProps = {
	createEvent,
	initializeNewEvent,
	push,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(NewEventForm);
