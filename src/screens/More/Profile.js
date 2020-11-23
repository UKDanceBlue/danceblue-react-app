// Import third-party dependencies
import React from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-elements";

import SignUpForm from "../../components/SignUpForm";
import LoginForm from "../../components/LoginForm";
import EditForm from "../../components/EditForm";

import { withFirebaseHOC } from "../../../config/Firebase";

// Component for profile screen in main navigation
class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      signUp: false,
      user: undefined,
      storeUser: [],
      isLoading: true,
      storeTeam: []
    };

    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    //this.getTeamName = this.getTeamName.bind(this);
  }

  componentDidMount() {
    this.props.firebase.checkAuthUser(user => {
      if (user) {
        this.setState({ loggedIn: true, user: user });
        // Firebase returns an array, make an empty array to hold the results
        let users = [];
        this.props.firebase.readUser(user.uid).then( snapshot => {
            snapshot.forEach(doc =>
                // Push results into array
                users.push({name: doc.name, email: doc.email, uid: doc.uid, team: doc.team, ...doc.data()})
            );
            // add user array into firestore.  Note: We only use the 0th element.
            this.setState({storeUser: users, isLoading: true});
            // We have to return the string value as a number for the next step.
            return parseInt(users[0].team, 10);
        }).then(userteam => {
            let teams = [];
            this.props.firebase.getTeam(userteam).then(snapshot => {
                snapshot.forEach(doc =>
                    teams.push({name: doc.name, number: doc.number, points: doc.points, ...doc.data()})
                );
                this.setState({storeTeam: teams, isLoading: false});
            });
        });

      }
    });



  }

  handleSignOut() {
    this.props.firebase.signOut().then(() => {
      this.setState({ loggedIn: false, signUp: false, user: undefined });
    });
  }

  handleSignIn() {
    if (this.state.signUp == true) {
        this.setState({ loggedIn: false, signUp: false, user: undefined });
    } else {
        this.setState({ loggedIn: false, signUp: true, user: undefined });
    }

  }

// Render the application view
  render() {
    const { navigate } = this.props.navigation;
    return (
      <>
        {this.state.loggedIn && !this.state.isLoading && (
          <View>
            <Text h2 >View Profile</Text>
            <EditForm name={this.state.storeUser[0].name} email={this.state.storeUser[0].email} team={this.state.storeUser[0].team} teamName = {this.state.storeTeam[0].name} teamPoints = {this.state.storeTeam[0].points}/>
            <Button title="Signout" onPress={this.handleSignOut} type="clear" />
          </View>
        )}
        {!this.state.loggedIn && !this.state.signUp && (
          <View>
            <Text h2 style={{ textAlign: "center" }}>
             Login
            </Text>
            <LoginForm />
            <Button title="New? Click here to Sign Up!" onPress={this.handleSignIn} type="clear" />
          </View>
        )}
        {!this.state.loggedIn && this.state.signUp && (
          <View>
            <Text h2 style={{ textAlign: "center" }}>
                Sign Up
            </Text>
            <SignUpForm />
            <Button title="Already signed up? Click here to Log in!" onPress={this.handleSignIn} type="clear" />
          </View>
        )}
      </>
    );
  }
}

export default withFirebaseHOC(ProfileScreen);
