// Import third-party dependencies
import React from 'react'
import { View } from 'react-native'
import { Input, Button } from 'react-native-elements'
import { Formik, ErrorMessage } from 'formik'

import { withFirebaseHOC } from '../../../config/Firebase'

/**
 * Component for profile screen in main navigation
 * @param {Object} props Properties of the component: (TODO)
 * @returns A React Native component
 * @author Kenton Carrier
 * @since 1.0.1
 * @class
 */
class SignUpForm extends React.Component {
  constructor (props) {
    super(props)

    this.handleSignup = this.handleSignUp.bind(this)
  }

  /**
   * Called when the user submits the login form, sends the details they entered to Firebase
   * 1. If the user logged in anonomously send a request for an anonymous user ID to firebase
   * 2. If the user created an account then send a sign-up request to firebase
   * @param {Object} values A user's *name*, *email*, and *password*
   * @param {Object} actions Used here to set an error if Firebase fails
   */
  handleSignUp (values, actions) {
    const { name, email, password } = values

    const user = this.props.firebase.getAuthUserInstance()
    if (user !== null) {
      this.props.firebase.linkAnon(email, password).then(res => {
        const { uid } = user
        const userData = { email, name }
        this.props.firebase.createNewUser(userData, uid).then(() => {
          if(this.props.navigate) this.props.navigate()
        })
      })
    } else {
      this.props.firebase
        .signupWithEmail(email, password)
        .then(res => {
          const { uid } = res.user
          const userData = { email, name }
          this.props.firebase.createNewUser(userData, uid).then(() => {
            if (this.props.navigate) this.props.navigate()
          })
        })
        .catch(error => actions.setFieldError('general', error.message))
    }
  }

  /**
   * Called to generate a React Native component
   * @returns A JSX formatted component
   */
  render () {
    return (
      <Formik
        initialValues={{ email: '', password: '', name: '' }}
        onSubmit={(values, actions) => this.handleSignUp(values, actions)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View>
            <Input
              name='name'
              placeholder='Name'
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            <ErrorMessage name='name' />
            <Input
              type='email'
              name='email'
              placeholder='Email'
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            <Input
              type='pass'
              name='password'
              placeholder='Password'
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            <Button
              containerStyle={{
                padding: 10,
                overflow: 'hidden'
              }}
              onPress={handleSubmit}
              title='Sign Up'
            />
          </View>
        )}
      </Formik>
    )
  }
}

export default withFirebaseHOC(SignUpForm)
