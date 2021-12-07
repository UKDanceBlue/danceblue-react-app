// Import third-party dependencies
import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';

// Import first-party dependencies
import Standings from './Standings';

/**
 * Wrapper for a Standings component
 */
const ScoreBoardScreen = () => (
  <ScrollView showsVerticalScrollIndicator>
    <SafeAreaView style={{ flex: 1 }}>
      <Standings expandable highlightedId="Tag-Howard" />
    </SafeAreaView>
  </ScrollView>
);

export default ScoreBoardScreen;
