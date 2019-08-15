import moment from "moment";
import updateFormFields from "../index";

const editForm = {
	_id: "5d54769658ae8d57e19a1ecc",
	seasonId: "20192020",
	seasonIds: ["20192020", "20202021", "20212022"],
	startMonth: "2019-08-01T07:00:00.000Z",
	endMonth: "2019-09-01T06:59:59.000Z",
	expirationDate: "2019-08-08T06:59:00.000Z",
	notes: "Hello",
	__v: 0,
};

describe("UpdateFormFields", () => {
	it("updates seasonIds field value, initialize selectOptions with seasonIds, and enables the field", () => {
		const field = {
			name: "seasonId",
			type: "select",
			label: "Season ID",
			placeholder: "Select a season id...",
			icon: "id",
			value: "",
			errors: "",
			required: true,
			disabled: true,
			selectOptions: [],
		};

		const updatedField = updateFormFields(field, editForm);

		expect(updatedField).toEqual({
			...field,
			selectOptions: editForm.seasonIds,
			value: editForm.seasonId,
			disabled: false,
		});
	});

	it("updates enrollMonth field value and enables the field", () => {
		const field = {
			type: "range",
			name: "enrollMonth",
			label: "Enrollment Month",
			tooltip:
				"All events within the date ranges specified below will be added to a new form.",
			value: [moment().startOf("month"), moment().endOf("month")],
			errors: "",
			required: true,
			disabled: true,
			format: "l",
		};

		const updatedField = updateFormFields(field, editForm);

		expect(updatedField).toEqual({
			...field,
			value: [moment(editForm.startMonth), moment(editForm.endMonth)],
			disabled: false,
		});
	});

	it("updates expirationDate field value and enables the field", () => {
		const field = {
			type: "date",
			name: "expirationDate",
			label: "Enrollment Expiration Date",
			placeholder: "Select a start date and time...",
			tooltip:
				"After the date specified below, responses will no longer be accepted nor will be able to be edited.",
			value: null,
			errors: "",
			required: true,
			disabled: true,
			format: "MM/DD/YYYY h:mm a",
			showTime: { format: "h:mm a", use12Hours: true },
			style: { width: "100%" },
		};

		const updatedField = updateFormFields(field, editForm);

		expect(updatedField).toEqual({
			...field,
			value: moment(editForm.expirationDate),
			disabled: false,
		});
	});

	it("updates notes field value and enables the field", () => {
		const field = {
			name: "notes",
			type: "textarea",
			label: "Notes",
			value: "",
			errors: "",
			placeholder: "(Optional) Include any special notes to add to the form...",
			required: false,
			disabled: true,
		};

		const updatedField = updateFormFields(field, editForm);

		expect(updatedField).toEqual({
			...field,
			value: editForm.notes,
			disabled: false,
		});
	});
});
