import { render } from "@testing-library/react-native";

import TimeUnit from ".";

describe("<TimeUnit />", () => {
  it("renders correctly with a singular unit", () => {
    const tree = render(<TimeUnit value={1} unit={"seconds"} />).toJSON() as unknown;

    expect(tree).toMatchSnapshot();
  });
  it("renders correctly with a plural unit", () => {
    const tree = render(<TimeUnit value={10} unit={"seconds"} />).toJSON() as unknown;

    expect(tree).toMatchSnapshot();
  });

  it("renders 0 with a negative value", () => {
    const tree = render(<TimeUnit value={-1} unit={"seconds"} />);

    const valueElement = tree.queryAllByText("0");
    expect(valueElement).toHaveLength(1);

    const unitElement = tree.queryAllByText("seconds");
    expect(unitElement).toHaveLength(1);
  });

  it("renders 0 with a nullish value", () => {
    // @ts-expect-error Testing nullish values
    const tree = render(<TimeUnit value={null} unit={"seconds"} />);

    const valueElement = tree.queryAllByText("0");
    expect(valueElement).toHaveLength(1);

    const unitElement = tree.queryAllByText("seconds");
    expect(unitElement).toHaveLength(1);
  });

  it("throws when passed an invalid type", () => {
    const mockedConsoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);

    const invalidUnit = "an invalid unit";
    // @ts-expect-error Testing an invalid unit
    expect(() => render(<TimeUnit value={1} unit={invalidUnit} />)).toThrow(`Invalid unit: ${invalidUnit}`);

    mockedConsoleError.mockRestore();
  });
});
