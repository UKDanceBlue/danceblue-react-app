/// <reference types="react" />
import React from 'react';
import { View, PixelRatio, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const HeaderIcons = ({ navigation, color }) => (
  <View
    style={[
      {
        flexDirection: 'row',
      },
    ]}
  >
    <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
      <FontAwesome5
        name="bell"
        color={color}
        style={{ textAlignVertical: 'center', padding: '5%', fontSize: PixelRatio.get() * 8 }}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
      <FontAwesome5
        name="user"
        color={color}
        style={{ textAlignVertical: 'center', padding: '5%', fontSize: PixelRatio.get() * 8 }}
      />
    </TouchableOpacity>
  </View>
);

export default HeaderIcons;
