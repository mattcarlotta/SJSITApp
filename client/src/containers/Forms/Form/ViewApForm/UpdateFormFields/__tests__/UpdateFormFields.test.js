import updateFormFields, { Label } from "../index";

const eventsGame = [
	{
		_id: "5d5b5ee857a6d20abf49db19",
		eventDate: "2019-08-21T02:30:36.000Z",
		eventType: "Game",
		location: "SAP Center at San Jose",
		notes: "",
		opponent: "Vegas Golden Knights",
		team: "San Jose Sharks",
	},
];

const eventsPromo = [
	{
		_id: "5d5b5ee857a6d20abf49db1a",
		eventDate: "2019-08-21T02:30:36.000Z",
		eventType: "Promotional",
		location: "SAP Center at San Jose",
		notes: "Sharks Fan Fest!",
		opponent: "",
		team: "San Jose Sharks",
	},
];

const eventResponses = [
	{
		_id: "5d5b5e952871780ef474807b",
		notes: "I'm gone all month.",
		response: "Prefer not to work.",
	},
];

const initProps = {
	eventType: "Game",
	eventDate: "2019-08-21T02:30:36.000Z",
	opponent: "Los Angeles Kings",
	team: "San Jose Sharks",
};

const nextProps = {
	eventType: "Promotional",
	eventDate: "2019-08-21T02:30:36.000Z",
	opponent: "",
	team: "San Jose Sharks",
};

describe("UpdateFormFields", () => {
	let wrapper;
	beforeEach(() => {
		wrapper = mount(<Label {...initProps} />);
	});

	it("initializes a radiogroup field value, adds a label, adds an updateEvent flag, includes event notes, and enables the field", () => {
		const field = {
			type: "radiogroup",
			value: "",
			errors: "",
			required: true,
			disabled: true,
			selectOptions: [
				"I want to work.",
				"Available to work.",
				"Prefer not to work.",
				"Not available to work.",
			],
		};

		const updatedField = updateFormFields([], field, eventsPromo, []);

		expect(updatedField).toEqual([
			{
				...field,
				id: eventsPromo[0]._id,
				name: eventsPromo[0]._id,
				value: "",
				label: (
					<Label
						eventType={eventsPromo[0].eventType}
						eventDate={eventsPromo[0].eventDate}
						opponent={eventsPromo[0].opponent}
						team={eventsPromo[0].team}
					/>
				),
				updateEvent: false,
				notes: eventsPromo[0].notes,
				disabled: false,
			},
			{
				id: eventsPromo[0]._id,
				name: `${eventsPromo[0]._id}-notes`,
				type: "textarea",
				value: "",
				errors: "",
				placeholder:
					"(Optional) Include any special notes for the above event...",
				required: false,
				disabled: false,
				width: "350px",
				rows: 3,
			},
		]);
	});

	it("updates a radiogroup field value, adds a label, adds an updateEvent flag, includes event notes, and enables the field", () => {
		const field = {
			type: "radiogroup",
			value: "",
			errors: "",
			required: true,
			disabled: true,
			selectOptions: [
				"I want to work.",
				"Available to work.",
				"Prefer not to work.",
				"Not available to work.",
			],
		};

		const updatedField = updateFormFields(
			[],
			field,
			eventsGame,
			eventResponses,
		);

		expect(updatedField).toEqual([
			{
				...field,
				id: eventsGame[0]._id,
				name: eventsGame[0]._id,
				value: eventResponses[0].response,
				label: (
					<Label
						eventType={eventsGame[0].eventType}
						eventDate={eventsGame[0].eventDate}
						opponent={eventsGame[0].opponent}
						team={eventsGame[0].team}
					/>
				),
				updateEvent: !!eventResponses[0].response,
				notes: eventsGame[0].notes,
				disabled: false,
			},
			{
				id: eventsGame[0]._id,
				name: `${eventsGame[0]._id}-notes`,
				type: "textarea",
				value: eventResponses[0].notes,
				errors: "",
				placeholder:
					"(Optional) Include any special notes for the above event...",
				required: false,
				disabled: false,
				width: "350px",
				rows: 3,
			},
		]);
	});

	it("displays a Label with two teams", () => {
		expect(wrapper.find(Label).exists()).toBeTruthy();
		expect(wrapper.find("DisplayFullDate").exists()).toBeTruthy();
		expect(wrapper.find("DisplayTeam")).toHaveLength(2);
		expect(wrapper.find(Label).text()).toContain(`(${initProps.eventType})`);
	});

	it("displays a Label with one team", () => {
		wrapper.setProps({ ...nextProps });
		expect(wrapper.find(Label).exists()).toBeTruthy();
		expect(wrapper.find("DisplayFullDate").exists()).toBeTruthy();
		expect(wrapper.find("DisplayTeam")).toHaveLength(1);
		expect(wrapper.find(Label).text()).toContain(`(${nextProps.eventType})`);
	});
});
