// Import third-party dependencies
import React from 'react';
import { View, Pressable, PixelRatio } from 'react-native';
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
        color={color}
        style={{ textAlignVertical: 'center', padding: '5%', fontSize: PixelRatio.get() * 8 }}
      />
    </Pressable>
    <Pressable onPress={() => navigation.navigate('Profile')}>
      <Icon
        name="user"
        color={color}
        style={{ textAlignVertical: 'center', padding: '5%', fontSize: PixelRatio.get() * 8 }}
      />
    </Pressable>
  </View>
);

export default HeaderIcons;
