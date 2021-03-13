import React from 'react'
import {
  View,
  Text,
  Image
} from 'react-native'
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import bdubs from '../../../assets/events/BDubs.jpg'

const EventRow = (props) => {
  const styles = props.styles
  const sDate = props.startDate.toDate()
  const eDate = props.endDate.toDate()
  const now = new Date();
  return (
           props.showIfToday && sDate.getMonth()==now.getMonth() && sDate.getDate()==now.getDate() || // if the today property is true and the event is today, or
           !props.showIfToday && sDate.getMonth()>=now.getMonth() && sDate.getDate()>now.getDate() // if the today property is false and the event is in the future
         ) && ( 
    <View key={props.id} style={styles.eventContainer}>
      <View style={styles.eventBox}>
        <View style={styles.eventInfo}>
          <View style={styles.eventTitleDateView}>
            <View style={styles.eventTitleView}>
              <Text
                style={styles.eventTitle}
                adjustsFontSizeToFit
                numberOfLines={2}
              >
                {props.title}
              </Text>
            </View>
            <View style={styles.eventDateView}>
              <Text style={styles.eventDate}>
                {sDate.toLocaleString('en-US', {weekday: 'short', month: 'numeric', day: 'numeric'}) + "    " + sDate.toLocaleString('en-US', {timeStyle:'short'}) + " - " + eDate.toLocaleString('en-US', {timeStyle:'short'})}
              </Text>
            </View>
          </View>
          <View style={styles.eventDetailsView}>
            <Text
              style={styles.eventDetails}
              adjustsFontSizeToFit
              numberOfLines={3}
            >
              {props.text}
            </Text>
          </View>
        </View>
        <View style={styles.eventImage}>
          <Image source={bdubs} style={styles.image} />
        </View>
      </View>
      <View style={styles.buttonView}>
        <Button
          style={styles.button}
          type='outline'
          raised
          icon={
            <Icon
              name='car'
              size={15}
              color='#0033A0'
            />
                    }
        />
        <Button
          style={styles.button}
          type='outline'
          raised
          icon={
            <Icon
              name='calendar'
              size={15}
              color='#0033A0'
            />
                    }
        />
      </View>
    </View>
  )
}

export default EventRow
