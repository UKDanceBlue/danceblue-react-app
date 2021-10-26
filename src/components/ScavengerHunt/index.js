import React from 'react'
import { Text, View, StyleSheet, ActivityIndicator, TouchableHighlight } from 'react-native'
import { Input, Button } from 'react-native-elements'
import { Formik, ErrorMessage } from 'formik'

import { withFirebaseHOC } from '../../../config/Firebase'

/**
 * Scavenger hunt tracker
 * @param {Object} props Properties of the component
 * @returns A React Native component
 * @author Kenton Carrier
 * @since 1.0.1
 * @class
 */
class ScavengerHunt extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      userID: props.userID,
      solved: false,
      isLoading: true
    }

    this.handleGuess = this.handleGuess.bind(this)
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   */
  componentDidMount() {
    this.props.firebase.getUserBadges(this.state.userID).then(snapshot => {
      snapshot.forEach(doc => {
        if (doc.id === 'scavenger-hunt-21') this.setState({ solved: true, guessed: true, guessText: 'You got it! Thank you for participating in the 2021 DB Scavenger Hunt' })
      })
      this.setState({ isLoading: false })
    })
  }

  /**
   * Checks if the user's guess was correct usign the checkScavengerHunt function in Firebase
   * @param {Object} values Holds the user's guess
   * @param {Object} actions Unused
   */
  handleGuess(values, actions) {
    const { guess } = values
    this.setState({ isLoading: true, guessed: true })
    fetch(
      'https://us-central1-react-danceblue.cloudfunctions.net/checkScavengerHunt',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          guess: guess,
          userID: this.state.userID
        })
      }
    )
      .then((response) => response.json())
      .then(json => {
        if (json.solved === true) this.setState({ solved: true })
        this.setState({ isLoading: false, guessText: json.message})
      })
  }

  /**
   * Called to generate a React Native component
   * @returns A JSX formatted component
   */
  render () {
    return (
      <View style={styles.container}>
        {this.state.isLoading && (
          <ActivityIndicator size='large' color='blue' />
        )}
        {!this.state.isLoading && (
          <>
            <View style={styles.titleView}>
              <Text style={styles.title}>SCAVENGER HUNT</Text>
            </View>
            {this.state.guessed && (
              <View style={styles.guessView}>
                <Text style={styles.resultText}>{this.state.guessText}</Text>
                {!this.state.solved && (
                  <Button
                      containerStyle={{
                      padding: 10,
                      overflow: 'hidden',
                      }}
                      buttonStyle={{
                        backgroundColor: '#0033A0E0'
                      }}
                      onPress={() => this.setState({ guessed: false })}
                      title='Try Again'
                    />
                )}
              </View>
            )}
            {!this.state.guessed && (
              <Formik
                initialValues={{ guess: '' }}
                onSubmit={(values, actions) => this.handleGuess(values, actions)}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                  <View>
                    <Input
                      name='guess'
                      placeholder='Enter the code here'
                      onChangeText={handleChange('guess')}
                      onBlur={handleBlur('guess')}
                      value={values.guess}
                    />
                  <ErrorMessage name='guess' />
                    <Button
                      containerStyle={{
                        padding: 10,
                        overflow: 'hidden',
                      }}
                      buttonStyle={{
                        backgroundColor: '#0033A0E0'
                      }}
                      onPress={handleSubmit}
                      title='Submit'
                    />
                  </View>
                )}
              </Formik>
            )}
          </>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
   backgroundColor: 'white',
   overflow: 'hidden',
   padding: 5,
   flex: 1
 },
 title: {
   flex: 1,
   fontSize: 20,
   fontWeight: 'bold'
 },
 titleView: {
   flex: 1,
 },
 resultText: {
   fontSize: 17
 },
 retryLink: {
   fontSize: 17,
   color: 'white',
   backgroundColor: 'blue'
 },
 guessView: {
   alignItems: 'center'
 }
})

export default withFirebaseHOC(ScavengerHunt)
