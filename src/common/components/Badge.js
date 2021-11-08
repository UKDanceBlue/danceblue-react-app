import React from 'react';
import { Text, View, Image, StyleSheet, ActivityIndicator } from 'react-native';

import { withFirebaseHOC } from '../../firebase/FirebaseContext';

/**
 * A badge icon for use with profiles
 * @param {Object} props Properties of the component: (imageURL, name)
 * @author Kenton Carrier
 * @since 1.0.1
 * @class
 */
class Badge extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   * @author Kenton Carrier
   * @since 1.0.1
   */
  componentDidMount() {
    this.props.core
      .getDocumentURL(this.props.imageURL)
      .then((url) => {
        this.setState({ imageRef: url, isLoading: false });
      })
      .catch((error) => console.log(error.message));
  }

  /**
   * Called to generate a React Native component
   * @returns A JSX formatted component
   * @author Kenton Carrier
   * @since 1.0.1
   */
  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading && (
          <ActivityIndicator style={styles.image} size="large" color="blue" />
        )}
        {!this.state.isLoading && (
          <>
            <Image style={styles.icon} source={{ uri: this.state.imageRef }} />
            <Text>{this.props.name}</Text>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 50,
    height: 50,
  },
});

export default withFirebaseHOC(Badge);
