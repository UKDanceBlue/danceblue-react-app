// Import third-party dependencies
import React from 'react';
import { Dimensions, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

// Import first-party dependencies
import SplashLogin from '../screens/Modals/SplashLogin';
import { withFirebaseHOC } from '../firebase/FirebaseContext';
import MainStackRoot from './MainStackRoot';

const RootStack = createStackNavigator();

class RootScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: null,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.props.auth.checkAuthUser((user) => {
      if (user !== null) this.setState({ userID: user.uid, isLoading: false });
      else this.setState({ isLoading: false });
    });
  }

  render() {
    if (this.state.isLoading)
      return (
        <Image
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          }}
          source={require('../../assets/splash2.png')}
        />
      );
    return (
      <RootStack.Navigator screenOptions={{ presentation: 'modal' }}>
        {this.state.userID && (
          <RootStack.Screen
            name="Main"
            component={MainStackRoot}
            options={{ headerShown: false }}
          />
        )}
        {!this.state.userID && (
          <RootStack.Screen
            name="SplashLogin"
            component={SplashLogin}
            options={{ headerShown: false }}
          />
        )}
      </RootStack.Navigator>
    );
  }
}

export default withFirebaseHOC(RootScreen);
