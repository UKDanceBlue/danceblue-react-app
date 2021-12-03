import React from 'react';
import renderer from 'react-test-renderer';
import GenericWebviewScreen from '../../src/screens/GenericWebviewScreen/GenericWebviewScreen';

describe('generic webview', () => {
  test('renders correctly', () => {
    const tree = renderer
      .create(<GenericWebviewScreen route={{ params: { uri: 'www.example.com' } }} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('shows 404 with no uri', () => {
    const tree = renderer.create(<GenericWebviewScreen route={{ params: {} }} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
