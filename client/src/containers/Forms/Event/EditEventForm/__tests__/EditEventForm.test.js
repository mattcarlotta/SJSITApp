import { EditEventForm } from "../index";
import moment from "moment";

const id = "5d4e00bcf2d83c45a863e2bc";
const fetchEvent = jest.fn();
const hideServerMessage = jest.fn();
const push = jest.fn();
const updateEvent = jest.fn();

const editEvent = {
	_id: "5d4e00bcf2d83c45a863e2bc",
	seasonIds: ["20002001", "20012002", "20022003"],
	league: "NHL",
	eventType: "Game",
	location: "SAP Center at San Jose",
	callTimes: [
		"2019-08-09T17:45:26-07:00",
		"2019-08-11T18:15:33-07:00",
		"2019-08-11T18:30:33-07:00",
		"2019-08-11T19:00:33-07:00",
	],
	uniform: "Sharks Teal Jersey",
	seasonId: "20192020",
	eventDate: "2019-08-10T02:30:31.834Z",
	notes: "",
};

const initProps = {
	editEvent: {},
	fetchEvent,
	hideServerMessage,
	match: {
		params: {
			id,
		},
	},
	push,
	serverMessage: "",
	updateEvent,
};

describe("New Event Form", () => {
	let wrapper;
	beforeEach(() => {
		wrapper = mount(<EditEventForm {...initProps} />);
	});

	afterEach(() => {
		fetchEvent.mockClear();
		hideServerMessage.mockClear();
		updateEvent.mockClear();
	});

	it("renders without errors", () => {
		expect(wrapper.find("Card").exists()).toBeTruthy();
	});

	it("shows a Spinner when fetching seasonIds", () => {
		expect(wrapper.find("Spinner").exists()).toBeTruthy();
	});

	it("calls fetchEvent on mount", () => {
		expect(fetchEvent).toHaveBeenCalledWith(id);
	});

	describe("Form Initializied", () => {
		beforeEach(() => {
			wrapper.setProps({ editEvent });
			wrapper.update();
		});

		it("initializes the fields and sets isLoading to false", () => {
			expect(wrapper.state("isLoading")).toBeFalsy();
		});

		it("adds/removes another call time slot", () => {
			expect(wrapper.find(".ant-row.ant-form-item")).toHaveLength(6);

			wrapper
				.find("button[type='button']")
				.at(1)
				.simulate("click");

			expect(wrapper.find(".ant-row.ant-form-item")).toHaveLength(7);

			wrapper
				.find("i.remove-time-slot")
				.first()
				.simulate("click");

			expect(wrapper.find(".ant-row.ant-form-item")).toHaveLength(6);
		});

		it("updates a field value when changed", () => {
			const name = "location";
			const newValue = "New Location @ Example";
			wrapper.instance().handleChange({ target: { name, value: newValue } });
			wrapper.update();

			expect(
				wrapper
					.find("input")
					.first()
					.props().value,
			).toEqual(newValue);
		});

		it("doesn't submit the form if a field has errors", () => {
			const name = "location";
			const newValue = "";
			wrapper.instance().handleChange({ target: { name, value: newValue } });
			wrapper.update();

			wrapper.find("form").simulate("submit");
			expect(updateEvent).toHaveBeenCalledTimes(0);
		});

		describe("Form Submission", () => {
			beforeEach(() => {
				jest.useFakeTimers();
				wrapper.find("form").simulate("submit");
				jest.runOnlyPendingTimers();
			});

			it("successful validation calls updateEvent with fields", done => {
				expect(wrapper.state("isSubmitting")).toBeTruthy();
				expect(updateEvent).toHaveBeenCalledWith({
					_id: id,
					seasonId: "20192020",
					league: "NHL",
					eventType: "Game",
					location: "SAP Center at San Jose",
					eventDate: expect.any(moment),
					uniform: "Sharks Teal Jersey",
					notes: "",
					callTimes: [
						"2019-08-09T17:45:26-07:00",
						"2019-08-11T18:15:33-07:00",
						"2019-08-11T18:30:33-07:00",
						"2019-08-11T19:00:33-07:00",
					],
				});
				done();
			});

			it("on submission error, enables the form submit button", done => {
				wrapper.setProps({ serverMessage: "Example error message." });

				expect(wrapper.state("isSubmitting")).toBeFalsy();
				expect(wrapper.find("button[type='submit']").exists()).toBeTruthy();
				done();
			});

			it("on form resubmission, if the serverMessage is still visible, it will hide the message", done => {
				wrapper.setProps({ serverMessage: "Example error message." });

				wrapper.find("form").simulate("submit");
				expect(hideServerMessage).toHaveBeenCalledTimes(1);
				done();
			});
		});
	});
});
