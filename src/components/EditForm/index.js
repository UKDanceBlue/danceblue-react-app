// Import third-party dependencies
import React from 'react'
import { View } from 'react-native'
import { Input } from 'react-native-elements'
import { Formik, ErrorMessage } from 'formik'

import { withFirebaseHOC } from '../../../config/Firebase'

// Component for profile screen in main navigation
class EditForm extends React.Component {
  constructor (props) {
    super(props)

    this.name = props.name
    this.email = props.email
    this.team = props.team
    this.teamname = props.teamName
    this.teampoints = props.teamPoints
    this.state = {
      name: props.name
    }

    this.handleSignup = this.handleSignUp.bind(this)
  }

  handleSignUp (values, actions) {
    const { name, email, team } = values
    const userData = {
      name: name,
      email: email,
      team: team
    }
    this.props.firebase.updateUser(userData).then(() => {
      if (this.props.navigate) this.props.navigate()
    })
      .catch(error => actions.setFieldError('general', error.message))
  }

  render () {
    return (
      <Formik
        initialValues={{ email: '', password: '', name: '', team: '' }}
        onSubmit={(values, actions) => this.handleSignUp(values, actions)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View>

            <Input
              name='name'
              placeholder={`Name: ${this.name}`}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            <ErrorMessage name='name' />
            <Input
              type='email'
              name='email'
              placeholder={`Email: ${this.email}`}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            <Input
              type='team'
              name='team'
              placeholder={`Team Number: ${this.team}`}
              onChangeText={handleChange('team')}
              onBlur={handleBlur('team')}
              value={values.team}
            />
            <Input
              type='teamname'
              name='teamname'
              placeholder={`Team Name: ${this.teamname}`}
              onChangeText={handleChange('teamname')}
              onBlur={handleBlur('teamname')}
              value={values.teamname}
            />
            <Input
              type='teampoints'
              name='teampoints'
              placeholder={`Team Points: ${this.teampoints}`}
              onChangeText={handleChange('teampoints')}
              onBlur={handleBlur('teampoints')}
              value={values.teampoints}
            />
          </View>
        )}
      </Formik>
    )
  }
}

export default withFirebaseHOC(EditForm)
// Extra code for submit button add to Formik view if we would like users to update profile themselves
/* <Button
              containerStyle={{
                padding: 10,
                overflow: "hidden"
              }}
              onPress={handleSubmit}
              title="Save Changes"
            /> */
