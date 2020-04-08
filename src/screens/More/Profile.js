// Import third-party dependencies
import React from "react";
import { Text, View } from "react-native";
import { Input, Button } from "react-native-elements";

import Icon from "react-native-vector-icons/FontAwesome5";

import { withFirebase } from "../../components/Firebase";

// Component for profile screen in main navigation
class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.props.firebase.doSignInWithEmailAndPassword();
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Input
          label="Email"
          autoCompleteType="email"
          textContentType="emailAddress"
          inputContainerStyle={{ bottom: 10 }}
        />
        <Input
          label="Password"
          autoCompleteType="password"
          textContentType="password"
          secureTextEntry={true}
          inputContainerStyle={{ bottom: 10 }}
        />
        <Button title="Login" onPress={this.handleSubmit} />
      </View>
    );
  }
}

export default withFirebase(ProfileScreen);
