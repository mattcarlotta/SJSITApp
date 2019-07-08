import fieldUpdater from "../index";

const fields = [
  {
    name: "email",
    type: "text",
    label: "Email",
    icon: "mail",
    value: "",
    errors: "",
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    icon: "lock",
    value: "",
    errors: "",
  }
];

describe("Field Updater Helper", () => {
  it("throws an error if missing required parameters", () => {
    const nextFields = fieldUpdater();
    expect(nextFields).toEqual("Error: You must supply a field array, name and value!");
  });

  it("updates a field", () => {
    const updatedEmail = "test@example.com"
    const updatedFields = fieldUpdater(fields, "email", updatedEmail);
    expect(updatedFields).toEqual(expect.arrayContaining([
      expect.objectContaining({
        value: updatedEmail
      })
    ]));
  });
});