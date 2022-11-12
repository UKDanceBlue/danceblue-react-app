import { renderWithNativeBase } from "../../../../common/test-helpers/NativeBase";

import { EventListPage } from "./EventListPage";

const mockLog = jest.fn();
const mockRecordError = jest.fn();

jest.mock("@react-native-firebase/crashlytics", () => jest.fn().mockImplementation(() => ({
  log: mockLog,
  recordError: mockRecordError
}))
);

describe("<EventListPage />", () => {
  it("renders correctly", () => {
    const tree = renderWithNativeBase(<EventListPage
      downloadableImages={{}}
      refreshing={false}
      refresh={() => Promise.resolve()}
      eventsByMonth={{}}
      marked={{}}
      tryToNavigate={() => undefined}
      monthString="2021-01"
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
