import React from 'react';
import renderer from 'react-test-renderer';
import MoreScreen from '../../src/screens/More';

test('renders correctly', () => {
  const tree = renderer.create(<MoreScreen navigation={{ navigate: () => {} }} />).toJSON();
  expect(tree).toMatchSnapshot();
});
