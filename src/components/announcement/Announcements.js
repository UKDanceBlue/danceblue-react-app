import React from 'react'
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native'

import { withFirebaseHOC } from '../../../config/Firebase'

const BulletPoint = props => {
  return (
    <View style={styles.announcementRow}>
      <View style={styles.bulletView}>
        <Text style={styles.bulletStyle}>{'\u2022' + ' '}</Text>
      </View>
      <View style={styles.bulletTextView}>
        <Text style={styles.announcementText}>{props.body}</Text>
      </View>
    </View>
  )
}

class Announcements extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      announcements: [],
      isLoading: true
    }
  }

  componentDidMount () {
    const announcements = []
    this.props.firebase.getAnnouncements().then(snapshot => {
      snapshot.forEach(doc =>
        announcements.push({ id: doc.id, ...doc.data() })
      )
      this.setState({ announcements: announcements, isLoading: false })
    })
  }

  render () {
    const bullets = this.state.announcements.map(announcement => (
      <BulletPoint body={announcement.body} key={announcement.id} />
    ))
    return (
      <View style={styles.container}>
        <View style={styles.announcementView}>
          <View style={styles.announcementTitleView}>
            <Text style={styles.announcementTitle}> ANNOUNCEMENTS </Text>
          </View>
          {!this.state.isLoading && bullets}
        </View>
        {this.state.isLoading && (
          <ActivityIndicator
            size='large'
            color='blue'
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20
            }}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '98%',
    marginBottom: 5,
    borderRadius: 15,
    borderColor: '#FFC72C',
    borderWidth: 1,
    overflow: 'hidden'
  },
  announcementView: {
    paddingLeft: 5,
    paddingBottom: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  announcementTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold'
  },
  announcementTitleView: {
    borderBottomColor: '#0033A0',
    borderBottomWidth: 2
  },
  announcementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    paddingTop: 5,
    paddingRight: 5,
    paddingLeft: 5
  },
  bulletView: {
    width: 15,
    fontSize: 20,
    alignSelf: 'flex-start'
  },
  bulletTextView: {
    flex: 1
  },
  bulletStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0033A0'
  },
  announcementText: {
    fontSize: 16
  }
})

export default withFirebaseHOC(Announcements)
