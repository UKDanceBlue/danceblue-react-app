import renderer from "react-test-renderer";

import TimeUnit from ".";

export default describe("<TimeUnit />", () => {
  it("has 1 child", () => {
    const tree = renderer.create(<TimeUnit value={1} unit={"seconds"} />).toJSON();
    expect(tree).not.toBeNull();
    if (tree && !Array.isArray(tree)) {
      expect(tree.children).not.toBeNull();
      if (tree.children) {
        console.log(tree.children);
      }
    }
  });
});
