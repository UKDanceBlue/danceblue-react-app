import React from 'react';
import renderer from 'react-test-renderer';
import { loadAsync } from 'expo-font';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import HeaderIcons from '../../../src/navigation/HeaderIcons';

beforeAll(async () => loadAsync(FontAwesome5.font));
beforeAll(async () => loadAsync(MaterialIcons.font));

test('renders correctly', () => {
  const tree = renderer.create(<HeaderIcons />).toJSON();
  expect(tree).toMatchSnapshot();
});
