// Import third-party dependencies
import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';

// Import first-party dependencies
import Standings from './Standings';

/**
 * Wrapper for a Standings component
 */
export const ScoreboardScreen = () => (
    <ScrollView showsVerticalScrollIndicator>
      <SafeAreaView style={{ flex: 1 }}>
        <Standings isExpanded />
      </SafeAreaView>
    </ScrollView>
  );

export default ScoreboardScreen;
