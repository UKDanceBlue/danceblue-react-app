// Import third-party dependencies
import React, { useState } from 'react';
import { View, Text } from 'react-native';

/**
 * A screen shown to users with an assigned team that display's their teams fundriaising total, and spirit point numbers
 */
const TeamScreen = () => {
  const [team, setTeam] = useState({});
  return (
    <View style={{ flex: 1 }}>
      <Text>Placeholder</Text>
    </View>
  );
};

export default TeamScreen;
