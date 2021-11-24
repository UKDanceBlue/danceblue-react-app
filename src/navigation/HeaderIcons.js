// Import third-party dependencies
import React from 'react';
import { View, Pressable, PixelRatio } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const HeaderIcons = ({ navigation, color }) => (
  <View
    style={[
      {
        flexDirection: 'row',
      },
    ]}
  >
    <Pressable onPress={() => navigation.navigate('Profile')}>
      <FontAwesome5
        name="bell"
        color={color}
        style={{ textAlignVertical: 'center', padding: '5%', fontSize: PixelRatio.get() * 8 }}
      />
    </Pressable>
    <Pressable onPress={() => navigation.navigate('Profile')}>
      <FontAwesome5
        name="user"
        color={color}
        style={{ textAlignVertical: 'center', padding: '5%', fontSize: PixelRatio.get() * 8 }}
      />
    </Pressable>
  </View>
);

export default HeaderIcons;
