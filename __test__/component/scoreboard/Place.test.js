import React from 'react';
import renderer from 'react-test-renderer';
import { loadAsync } from 'expo-font';
import { FontAwesome5 } from '@expo/vector-icons';
import { Place } from '../../../src/screens/ScoreBoardScreen';

beforeAll(async () => loadAsync(FontAwesome5.font));

describe('Place component', () => {
  test('renders correctly normally', () => {
    const tree = renderer
      .create(<Place rank={4} teamName="Team Name" teamNumber={69} points={420} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly highlighted', () => {
    const tree = renderer
      .create(<Place isHighlighted rank={4} teamName="Team Name" teamNumber={69} points={420} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly 1st place', () => {
    const tree = renderer
      .create(<Place rank={1} teamName="Team Name" teamNumber={69} points={420} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly 2nd place', () => {
    const tree = renderer
      .create(<Place rank={1} teamName="Team Name" teamNumber={69} points={420} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly 3rd place', () => {
    const tree = renderer
      .create(<Place rank={1} teamName="Team Name" teamNumber={69} points={420} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
