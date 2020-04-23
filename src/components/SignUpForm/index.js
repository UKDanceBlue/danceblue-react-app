// Import third-party dependencies
import React from "react";
import { View } from "react-native";
import { Input, Button } from "react-native-elements";
import { Formik, ErrorMessage } from "formik";

import Icon from "react-native-vector-icons/FontAwesome5";

import { withFirebaseHOC } from "../../../config/Firebase";

// Component for profile screen in main navigation
class SignUpForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSignup = this.handleSignUp.bind(this);
  }

  handleSignUp(values, actions) {
    const { name, email, password } = values;

    this.props.firebase
      .signupWithEmail(email, password)
      .then(res => {
        const { uid } = res.user;
        const userData = { email, name, uid };
        this.props.firebase.createNewUser(userData).then(() => {
          if (this.props.navigate) this.props.navigate();
        });
      })
      .catch(error => actions.setFieldError("general", error.message));
  }

  render() {
    return (
      <Formik
        initialValues={{ email: "", password: "", name: "" }}
        onSubmit={(values, actions) => this.handleSignUp(values, actions)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View>
            <Input
              name="name"
              placeholder="Name"
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
            />
            <ErrorMessage name="name" />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            <Input
              type="pass"
              name="password"
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />
            <Button
              containerStyle={{
                padding: 10,
                overflow: "hidden"
              }}
              onPress={handleSubmit}
              title="Sign Up"
            />
          </View>
        )}
      </Formik>
    );
  }
}

export default withFirebaseHOC(SignUpForm);
