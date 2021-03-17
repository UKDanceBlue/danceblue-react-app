import React from 'react'
import {
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  View
} from 'react-native'
import { withFirebaseHOC } from '../../../config/Firebase'
import moment from 'moment'

class EventRow extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      imageRef: '',
      isLoading: true
    }
  }

  componentDidMount () {
    if (this.props.imageLink) {
    this.props.firebase
      .getDocumentURL(this.props.imageLink)
      .then(url => {
        this.setState({ imageRef: url, isLoading: false })
      })
      .catch(error => console.log(error.message))
    } else {
      this.setState({ imageRef: '', isLoading: false})
    }
  }

  render () {
    let startDate = moment(this.props.startDate)
    let endDate = moment(this.props.endDate)
    let whenString = ''
    if (startDate.isSame(endDate, 'day')) {
      whenString = `${startDate.format('M/D/YYYY h:mm a')} - ${endDate.format('h:mm a')}`
    } else {
      whenString = `${startDate.format('M/D/YYYY h:mm a')} - ${endDate.format('M/D/YYYY h:mm a')}`
    }
    return (
      <View style={styles.body}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{this.props.title}</Text>
          <Text style={styles.date}>{whenString}</Text>
        </View>
        <View style={styles.imageContainer}>
          {this.state.isLoading && (<ActivityIndicator color='#0033A0' size='large' />)}
          {!this.state.isLoading && (<Image style={styles.image} source={{ uri: this.state.imageRef }} />)}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 10,
    flex: 1,
    borderWidth: 2,
    borderColor: '#3248a8'
  },
  date: {
    fontSize: 17,
    flex: 1,
    flexGrow: 0,
    flexShrink: 1
  },
  image: {
    flex: 1,
    resizeMode: 'contain'
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  textContainer: {
    flex: 4,
    flexGrow: 1,
    flexShrink: 1
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    flexGrow: 0,
    flexShrink: 1
  },
})

export default withFirebaseHOC(EventRow)
