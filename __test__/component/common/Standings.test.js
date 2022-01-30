import React from 'react';
import renderer from 'react-test-renderer';
import { loadAsync } from 'expo-font';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import Standings from '../../../src/common/components/Standings';

beforeAll(async () => loadAsync(FontAwesome5.font));
beforeAll(async () => loadAsync(MaterialIcons.font));

describe('Standings component', () => {
  jest.useFakeTimers();
  test('renders correctly with no highlighted paramter', () => {
    const standingData = [
      {
        id: '1',
        name: 'Test 1',
        points: 111,
      },
      {
        id: '2',
        name: 'Test 2',
        points: 222,
      },
      {
        id: '3',
        name: 'Test 3',
        points: 333,
      },
      {
        id: '4',
        name: 'Test 4',
        points: 444,
      },
      {
        id: '5',
        name: 'Test 5',
        points: 555,
      },
    ];
    const tree = renderer.create(<Standings standingData={standingData} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly expanded', () => {
    const standingData = [
      {
        highlighted: false,
        id: '1',
        name: 'Test 1',
        points: 111,
      },
      {
        highlighted: false,
        id: '2',
        name: 'Test 2',
        points: 222,
      },
      {
        highlighted: false,
        id: '3',
        name: 'Test 3',
        points: 333,
      },
      {
        highlighted: false,
        id: '4',
        name: 'Test 4',
        points: 444,
      },
      {
        highlighted: false,
        id: '5',
        name: 'Test 5',
        points: 555,
      },
    ];
    const tree = renderer
      .create(<Standings standingData={standingData} expandable startExpanded />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly with 4 collapsed rows', () => {
    const standingData = [
      {
        highlighted: false,
        id: '1',
        name: 'Test 1',
        points: 111,
      },
      {
        highlighted: false,
        id: '2',
        name: 'Test 2',
        points: 222,
      },
      {
        highlighted: false,
        id: '3',
        name: 'Test 3',
        points: 333,
      },
      {
        highlighted: false,
        id: '4',
        name: 'Test 4',
        points: 444,
      },
      {
        highlighted: false,
        id: '5',
        name: 'Test 5',
        points: 555,
      },
    ];
    const tree = renderer
      .create(<Standings standingData={standingData} collapsedRows={4} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly with a title', () => {
    const standingData = [
      {
        highlighted: false,
        id: '1',
        name: 'Test 1',
        points: 111,
      },
      {
        highlighted: false,
        id: '2',
        name: 'Test 2',
        points: 222,
      },
      {
        highlighted: false,
        id: '3',
        name: 'Test 3',
        points: 333,
      },
      {
        highlighted: false,
        id: '4',
        name: 'Test 4',
        points: 444,
      },
      {
        highlighted: false,
        id: '5',
        name: 'Test 5',
        points: 555,
      },
    ];
    const tree = renderer
      .create(<Standings titleText="Test Title" standingData={standingData} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
