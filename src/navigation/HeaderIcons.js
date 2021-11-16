// Import third-party dependencies
import React from 'react';
import { View, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const HeaderIcons = ({ navigation, color }) => (
  <View
    style={[
      {
        flexDirection: 'row',
      },
    ]}
  >
    <Pressable onPress={() => navigation.navigate('Profile')}>
      <Icon
        name="bell"
        size="25%"
        color={color}
        style={{ textAlignVertical: 'center', padding: '5%' }}
      />
    </Pressable>
    <Pressable onPress={() => navigation.navigate('Profile')}>
      <Icon
        name="user"
        size="25%"
        color={color}
        style={{ textAlignVertical: 'center', padding: '5%' }}
      />
    </Pressable>
  </View>
);

export default HeaderIcons;
