import React from 'react'
import {
  View,
  Text,
  Image,
  ActivityIndicator
} from 'react-native'
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import bdubs from '../../../assets/events/BDubs.jpg'
import { withFirebaseHOC } from '../../../config/Firebase'

class EventRow extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            imageRef: "",
            isLoading: true
        }
    }
    componentDidMount () {
    this.props.firebase
      .getDocumentURL(this.props.imageLink)
      .then(url => {
        this.setState({ imageRef: url, isLoading: false })
      })
      .catch(error => console.log(error.message))
  }
  render() {
  const props = this.props
  const styles = props.styles
  const sDate = props.startDate.toDate()
  const eDate = props.endDate.toDate()
  const now = new Date();
  return (
           props.showIfToday && sDate.getMonth()==now.getMonth() && sDate.getDate()==now.getDate() || // if the today property is true and the event starts today, or
           props.showIfToday && sDate < now && eDate > now || // if the today property is true and the event is current, or
           !props.showIfToday && sDate.getMonth()>=now.getMonth() && sDate.getDate()>now.getDate() // if the today property is false and the event starts sometime after today
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
                { sDate.getMonth()==eDate.getMonth() && sDate.getDate()==eDate.getDate() && // if the event starts and ends on the same day
                  sDate.toLocaleString('en-US', {weekday: 'short', month: 'numeric', day: 'numeric'}) + "    " + sDate.toLocaleString('en-US', {timeStyle:'short'}) + " - " + eDate.toLocaleString('en-US', {timeStyle:'short'})
                }
                { (sDate.getDate()!=eDate.getDate() || sDate.getMonth()!=eDate.getMonth()) &&
                  sDate.toLocaleString('en-US', {weekday: 'short', month: 'numeric', day: 'numeric'}) + "  -  " + eDate.toLocaleString('en-US', {weekday: 'short', month: 'numeric', day: 'numeric'})
                }
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
          {this.state.isLoading && (
            <ActivityIndicator style={styles.image} size='large' color='blue' />
          )}
          {!this.state.isLoading && (
            <Image source={{ uri:this.state.imageRef}} style={styles.image} />
          )}
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

      </View>
    </View>
  )
  }
}/*
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
        />*/
export default withFirebaseHOC(EventRow)
