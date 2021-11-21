import React from 'react';
import renderer from 'react-test-renderer';
import GenericWebviewScreen from '../../src/screens/GenericWebviewScreen';

test('renders correctly', () => {
  const tree = renderer
    .create(<GenericWebviewScreen route={{ params: { uri: 'www.google.com' } }} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
