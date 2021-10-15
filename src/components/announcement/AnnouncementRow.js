import React from 'react'
import { View, Text } from 'react-native'

/**
 * A simple row for displaying announcemnts 
 * @param {Object} props Properties of the component: (styles,id,text)
 * @returns A React Native component
 * @author Kenton Carrier
 * @since 1.0.1
 * @class
 */
const AnnouncementRow = (props) => {
  const styles = props.styles
  return (
    <View key={props.id} style={styles.announcementRow}>
      <View style={styles.bulletView}>
        <Text style={styles.bulletStyle}>{'\u2022' + ' '}</Text>
      </View>
      <View style={styles.bulletTextView}>
        <Text style={styles.announcementText}>{props.text}</Text>
      </View>
    </View>
  )
}

export default AnnouncementRow
