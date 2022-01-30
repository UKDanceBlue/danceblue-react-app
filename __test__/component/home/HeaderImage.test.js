import React from 'react';
import renderer from 'react-test-renderer';
import { loadAsync } from 'expo-font';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import HeaderImage from '../../../src/screens/HomeScreen/HeaderImage';

beforeAll(async () => loadAsync(FontAwesome5.font));
beforeAll(async () => loadAsync(MaterialIcons.font));

test('renders correctly', () => {
  const tree = renderer.create(<HeaderImage />).toJSON();
  expect(tree).toMatchSnapshot();
});
