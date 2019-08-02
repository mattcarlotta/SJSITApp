import Line from "../index";

const initProps = {
	width: "",
};

describe("Line", () => {
	let wrapper;
	let StyledLine;
	beforeEach(() => {
		wrapper = mount(<Line {...initProps} />);
		StyledLine = () => wrapper.find("Line");
	});

	it("renders without errors", () => {
		expect(StyledLine().exists()).toBeTruthy();
		expect(StyledLine()).toHaveStyleRule("width", "100%");
	});

	it("renders without errors", () => {
		wrapper.setProps({ width: "100px" });
		expect(StyledLine()).toHaveStyleRule("width", "100px");
	});
});