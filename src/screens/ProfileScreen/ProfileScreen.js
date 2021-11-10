// Import third-party dependencies
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-elements';

import { withFirebaseHOC } from '../../firebase/FirebaseContext';

/**
 * Component for "Profile" screen in main navigation
 * @param {Object} props Properties of the component: navigation, firebase
 * @class
 */
class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      user: undefined,
      formShown: 'signup',
      isLoading: true,
    };

    this.handleSignOut = this.handleSignOut.bind(this);
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   */
  componentDidMount() {
    this.props.auth.checkAuthUser((user) => {
      if (user !== null) {
        if (!user.isAnonymous) {
          const userID = user.uid;
          this.props.firestore.getUser(userID).then((doc) => {
            const userData = doc.data();
            this.setState({
              loggedIn: true,
              user: { id: user.uid, ...userData },
              isLoading: false,
            });
          });
        }
      }
    });
    this.setState({ isLoading: false });
  }

  /**
   * Have firebase sign out the current user and then sign in an anonomous user
   */
  handleSignOut() {
    this.props.auth
      .signOut()
      .then(() => this.props.auth.signInAnon())
      .then(() => this.setState({ loggedIn: false, user: undefined }));
  }

  /**
   * Called by React Native when rendering the screen
   * @returns A JSX formatted Component
   */
  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <>
          {
            /* Start of still loading view */ this.state.isLoading && (
              <ActivityIndicator style={styles.image} size="large" color="blue" />
            ) /* End of still loading view */
          }
          {
            /* Start of finished loading view */ !this.state.isLoading && (
              <>
                {
                  /* Start of logged in view */ this.state.loggedIn && (
                    <>
                      <Text>WIP</Text>
                    </>
                  ) /* End of logged in view */
                }
                {
                  /* Start of logged out view */ !this.state.loggedIn && (
                    <>
                      <Text>WIP</Text>
                    </>
                  ) /* End of logged in view */
                }
              </>
            ) /* End of finished loading view */
          }
        </>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badges: {
    flex: 5,
  },
  avatar: {
    flex: 1,
    height: 100,
    width: 100,
    resizeMode: 'contain',
    paddingLeft: 50,
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitleView: {
    borderBottomColor: '#0033A0',
    borderBottomWidth: 1,
    textAlign: 'center',
  },
  container: {
    overflow: 'hidden',
    padding: 10,
    flex: 1,
  },
});

export default withFirebaseHOC(ProfileScreen);
