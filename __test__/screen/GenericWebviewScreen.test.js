import React from 'react';
import renderer from 'react-test-renderer';
import GenericWebviewScreen from '../../src/screens/GenericWebviewScreen';

it('renders correctly', () => {
  const tree = renderer.create(
    <GenericWebviewScreen route={{ params: { uri: 'www.example.com' } }} />
  );
  expect(tree).toMatchSnapshot();
});
