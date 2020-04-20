// Import third-party dependencies
import React from "react";
import { Text, View, StyleSheet, ScrollView, SafeAreaView, TouchableHighlight } from "react-native";
import Event from '../../components/event/Event';
import EventDetails from '../../components/event/EventDetails';
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

class EventsList extends React.Component {
  
  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.container}>
          <View style={styles.sectionTitleView}>
            <Text style={styles.sectionTitle}> HAPPENING NOW </Text>
          </View>
          <Event
            style={styles.eventRow}
            onPress={() => this.navigate('Details', {
              test: 'anything you want here',
            })
          }
          />
          <View style={styles.sectionTitleView}>
            <Text style={styles.sectionTitle}> COMING UP </Text>
          </View>
          <Event
            style={styles.eventRow}
            onPress={() => navigate('Details', {
              test: 'anything you want here',
            })
          }
          />
        </SafeAreaView>
      </ScrollView>
    );
  }
}

// Component for events screen in main navigation
export class EventsScreen extends React.Component {
  static navigationOptions = {
    title: "Events"
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Stack.Navigator>
        <Stack.Screen name="Events" component={EventsList} />
        <Stack.Screen name="Details" component={EventDetails} />
      </Stack.Navigator>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    justifyContent:'center',
    alignItems:'center',
    marginTop:5
  },
  sectionTitle: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
  },
  sectionTitleView: {
    marginLeft:5,
    marginBottom:13,
    borderBottomColor: "#0033A0",
    borderBottomWidth: 2,
    alignSelf:'flex-start',
  },
  eventRow: {
    justifyContent:'center',
    alignItems: 'center',
  },
});
