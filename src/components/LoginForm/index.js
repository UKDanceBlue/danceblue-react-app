// Import third-party dependencies
import React from 'react'
import { View } from 'react-native'
import { Input, Button } from 'react-native-elements'
import { Formik } from 'formik'

import { withFirebaseHOC } from '../../../config/Firebase'

// Component for profile screen in main navigation
class LoginForm extends React.Component {
  constructor (props) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
  }

  handleLogin (values, actions) {
    const { email, password } = values

    this.props.firebase.checkAuthUser(user => {
      if (user !== null) {
        this.props.firebase
          .loginWithEmail(email, password)
          .then(res => {
            if (this.props.navigate) this.props.navigate()
          })
          .catch(error => actions.setFieldError('general', error.message))
      } else {
        this.props.firebase
          .loginWithEmail(email, password)
          .then(res => {
            if (this.props.navigate) this.props.navigate()
          })
          .catch(error => actions.setFieldError('general', error.message))
      }
    })
  }

  render () {
    return (
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={(values, actions) => this.handleLogin(values, actions)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View>
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
              title='Login'
            />
          </View>
        )}
      </Formik>
    )
  }
}

export default withFirebaseHOC(LoginForm)
