import AppLoader from "../index";

const authenticateUser = jest.fn();
const hideServerMessage = jest.fn();

const initProps = {
	authenticateUser,
	hideServerMessage,
	loggedinUser: "",
	serverMessage: "",
};

const initState = {
	requestTimeout: false,
};

jest.useFakeTimers();

describe("App Loader", () => {
	let wrapper;
	beforeEach(() => {
		wrapper = shallow(<AppLoader {...initProps} />, initState);
	});

	afterEach(() => {
		jest.runAllTimers();
		authenticateUser.mockClear();
	});

	it("initially renders a Spinner", () => {
		expect(wrapper.find("Spinner__StyledSpinner").exists()).toBeTruthy();
	});

	it("attempts to automatically log the user in from a previous session", () => {
		expect(authenticateUser).toHaveBeenCalledTimes(1);
	});

	it("renders a login form after a 5 second timer", () => {
		jest.runOnlyPendingTimers();
		expect(wrapper.state("requestTimeout")).toBeTruthy();
		expect(wrapper.find("LoginForm").exists()).toBeTruthy();
	});

	it("renders a login form if the loggedinUser is determined to be false via API", () => {
		wrapper.setProps({ loggedinUser: false });
		expect(wrapper.find("LoginForm").exists()).toBeTruthy();
	});
});