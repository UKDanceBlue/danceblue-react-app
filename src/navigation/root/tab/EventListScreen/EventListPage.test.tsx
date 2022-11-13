import { renderWithNativeBase } from "../../../../../test-helpers/NativeBase";

import { EventListPage } from "./EventListPage";

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
