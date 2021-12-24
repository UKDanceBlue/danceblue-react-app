import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../../theme';

/**
 * Component for "Profile" screen in main navigation
 */
const NotificationScreen = () => {
  [notifications, setNotifications] = useState([]);
  return (
    <View style={globalStyles.genericView}>
      <Text>NYI</Text>
    </View>
  );
};

export default NotificationScreen;
