import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Card } from "antd";
import { FaFolderPlus } from "react-icons/fa";
import { createSeason } from "actions/Seasons";
import BackButton from "components/Body/BackButton";
import FormContainer from "components/Body/FormContainer";
import SubmitButton from "components/Body/SubmitButton";
import FieldGenerator from "components/Forms/FieldGenerator";
import FormTitle from "components/Forms/FormTitle";
import fieldValidator from "utils/fieldValidator";
import fieldUpdater from "utils/fieldUpdater";
import parseFields from "utils/parseFields";
import fields from "./Fields";

const title = "New Season";
const iconStyle = {
	verticalAlign: "middle",
	marginRight: 10,
	fontSize: 20,
};

export class NewSeasonForm extends Component {
	state = {
		fields,
		seasonId: "",
		isSubmitting: false,
	};

	static getDerivedStateFromProps = ({ serverMessage }) =>
		serverMessage ? { isSubmitting: false } : null;

	handleChange = ({ target: { name, value } }) => {
		let seasonId = "";

		if (!isEmpty(value)) {
			const [startYear, endYear] = value;
			seasonId = `${startYear.format("YYYY")}${endYear.format("YYYY")}`;
		}

		this.setState(prevState => {
			const updateFields = prevState.fields.map(field =>
				field.type === "text" ? { ...field, value: seasonId } : { ...field },
			);

			return {
				...prevState,
				fields: fieldUpdater(updateFields, name, value),
			};
		});
	};

	handleSubmit = e => {
		e.preventDefault();

		const { validatedFields, errors } = fieldValidator(this.state.fields);

		this.setState({ fields: validatedFields, isSubmitting: !errors }, () => {
			const { fields: formFields } = this.state;

			if (!errors) {
				const parsedFields = parseFields(formFields);
				this.props.createSeason({ ...parsedFields });
			}
		});
	};

	render = () => (
		<Card
			extra={
				<BackButton
					push={this.props.push}
					location="/employee/seasons/viewall?page=1"
				/>
			}
			title={
				<Fragment>
					<FaFolderPlus style={iconStyle} />
					<span css="vertical-align: middle;">{title}</span>
				</Fragment>
			}
		>
			<FormContainer>
				<FormTitle
					header={title}
					title={title}
					description="Enter a new season by selecting a start and end date."
				/>
				<form onSubmit={this.handleSubmit}>
					<FieldGenerator
						fields={this.state.fields}
						onChange={this.handleChange}
					/>
					<SubmitButton
						isSubmitting={this.state.isSubmitting}
						title="Create Season"
					/>
				</form>
			</FormContainer>
		</Card>
	);
}

NewSeasonForm.propTypes = {
	createSeason: PropTypes.func.isRequired,
	push: PropTypes.func.isRequired,
	serverMessage: PropTypes.string,
};

const mapStateToProps = state => ({
	serverMessage: state.server.message,
});

const mapDispatchToProps = {
	createSeason,
	push,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewSeasonForm);
