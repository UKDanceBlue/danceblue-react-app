// Import third-party dependencies
import React from 'react'
import { View } from 'react-native'
import { Input } from 'react-native-elements'
import { Formik, ErrorMessage } from 'formik'

import { withFirebaseHOC } from '../../../config/Firebase'

/**
 * A component allowing a user to edit their account details
 * @param {Object} props Properties of the component: name, email, team, teamName, teamPoints, navigate(), firebase
 * @returns A React Native component
 * @author Kenton Carrier
 * @since 1.0.1
 * @class
 */
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

    this.handleSignup = this.handleDataUpdate.bind(this)
  }

  /**
   * Update a user's details based on form contents
   * @param {Object} values A user's *name*, *email*, and *team*
   * @param {Object} actions  Used here to set an error if Firebase fails
   */
  handleDataUpdate (values, actions) {
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

  /**
   * Called to generate a React Native component
   * @returns A JSX formatted component
   */
  render () {
    return (
      <Formik
        initialValues={{ email: '', password: '', name: '', team: '' }}
        onSubmit={(values, actions) => this.handleDataUpdate(values, actions)}
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
