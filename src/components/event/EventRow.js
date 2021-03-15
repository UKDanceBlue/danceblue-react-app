import React from 'react'
import {
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
    return (
        <Text>{this.props.title}</Text>
    )
  }
}

export default withFirebaseHOC(EventRow)
