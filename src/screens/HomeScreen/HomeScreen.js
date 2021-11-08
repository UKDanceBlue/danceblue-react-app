// Import third-party dependencies
import React from "react";
import { SafeAreaView, ScrollView } from "react-native";

// Import first-party dependencies
import SponsorCarousel from "./SponsorCarousel";
import CountdownView from "../../common/components/CountdownView";
import HeaderImage from "./HeaderImage";
import { withFirebaseHOC } from "../../firebase/FirebaseContext";

/**
 * Component for home screen in main navigation
 * @param {Object} props Properties of the component: navigation, firebase
 * @author Tag Howard, Kenton Carrier
 * @since 1.0.1
 * @class
 */
class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeCountdown: true,
    };
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   * @author Kenton Carrier
   * @since 1.0.1
   */
  componentDidMount() {
    this.props.firebase.getConfig().then((doc) => {
      this.setState({ activeCountdown: doc.data().activeCountdown });
    });
    this.props.auth.checkAuthUser((user) => {
      if (user !== null) {
        if (!user.isAnonymous) {
          this.setState({ userID: user.uid });
        }
      }
    });
  }

  /**
   * Called by React Native when rendering the screen
   * @returns A JSX formatted Component
   * @author Kenton Carrier
   * @since 1.0.1
   */
  render() {
    /* eslint-disable */
    const { navigate } = this.props.navigation;

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={{ flex: 1 }}>
          <HeaderImage />
          {this.state.activeCountdown && <CountdownView />}
          <SponsorCarousel />
        </SafeAreaView>
      </ScrollView>
    );
  }
}

HomeScreen.navigationOptions = {
  title: "Home",
};

export default withFirebaseHOC(HomeScreen);
