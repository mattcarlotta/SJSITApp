import React, { Component } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { Input } from "components/Forms";
import { SubmitButton } from "components/Body";
import { fieldValidator, fieldUpdater, parseFields } from "utils";

class EditMemberForm extends Component {
	state = {
		fields: [
			{
				name: "email",
				type: "email",
				label: "Authorized Email",
				icon: "mail",
				value: "",
				errors: "",
				required: true,
			},
			{
				name: "firstName",
				type: "text",
				label: "First Name",
				icon: "user",
				value: "",
				errors: "",
				required: true,
			},
			{
				name: "lastName",
				type: "text",
				label: "Last Name",
				icon: "user",
				value: "",
				errors: "",
				required: true,
			},
			{
				name: "role",
				type: "select",
				label: "Role",
				icon: "user",
				value: "",
				errors: "",
				required: true,
			},
		],
		isFocused: "",
		wasEdited: false,
		wasInitialized: false,
		isSubmitting: false,
	};

	static getDerivedStateFromProps = ({ viewMember, serverMessage }, state) => {
		if (!state.wasInitialized && !isEmpty(viewMember)) {
			const values = [
				viewMember.email,
				viewMember.firstName,
				viewMember.lastName,
				viewMember.role,
			];

			return {
				fields: state.fields.map((field, key) => ({
					...field,
					value: values[key],
				})),
				wasInitialized: true,
			};
		}

		if (serverMessage) return { isSubmitting: false };

		return null;
	};

	handleChange = ({ target: { name, value } }) => {
		this.setState(prevState => ({
			...prevState,
			wasEdited: true,
			fields: fieldUpdater(prevState.fields, name, value),
		}));
	};

	handleFocus = ({ target: { name } }) => this.setState({ isFocused: name });

	handleSubmit = e => {
		e.preventDefault();
		const { validatedFields, errors } = fieldValidator(this.state.fields);

		this.setState({ fields: validatedFields, isSubmitting: !errors }, () => {
			const { fields: formFields } = this.state;
			const { hideServerMessage, serverMessage } = this.props;

			if (!errors) {
				const signinFields = parseFields(formFields);

				if (serverMessage) hideServerMessage();
				// setTimeout(() => signinUser(signinFields), 350);
			}
		});
	};

	render = () => (
		<form style={{ width: 400, marginTop: 10 }} onSubmit={this.handleSubmit}>
			{this.state.fields.map(props =>
				props.type != "select" ? (
					<Input
						{...props}
						key={props.name}
						isFocused={this.state.isFocused}
						onChange={this.handleChange}
						onBlur={this.handleBlur}
						onFocus={this.handleFocus}
					/>
				) : (
					<p key={props.name}>Select</p>
				),
			)}
			<SubmitButton
				title="Update"
				disabled={!this.state.wasInitialized || !this.state.wasEdited}
				isSubmitting={this.state.isSubmitting}
			/>
		</form>
	);
}

EditMemberForm.propTypes = {
	viewMember: PropTypes.shape({
		_id: PropTypes.string,
		email: PropTypes.string.isRequired,
		events: PropTypes.any,
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		registered: PropTypes.string,
		role: PropTypes.string.isRequired,
		schedule: PropTypes.any,
		status: PropTypes.string,
	}).isRequired,
};

export default EditMemberForm;
