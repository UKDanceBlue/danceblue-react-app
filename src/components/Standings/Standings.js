// Standings implementation for the Morale Cup leaderboard
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator
} from "react-native";
import Place from "./place";

import { withFirebaseHOC } from "../../../config/Firebase";

const styles = StyleSheet.create({
  container: {
    width: "98%",
    marginBottom: 5,
    borderColor:'#FFC72C',
    borderWidth:1,
    borderRadius:15,
    overflow:"hidden",
  },
  ListView: {
    paddingLeft: 5,
    marginTop: 5,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    flex: 1
  },
  ListTitle: {
    fontSize: 20,
    fontWeight: "bold",
    borderBottomColor: "#0033A0",
    borderBottomWidth: 2
  },
  ListTitleView: {
    borderBottomColor: "#0033A0",
    borderBottomWidth: 2
  },
  more: {
    justifyContent: "flex-end"
  }
});

class Standings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allTeams: [],
      shownNumber: this.props.shownNumber | 3,
      topNumber: this.props.topNumber | 3,
      isLoading: true
    };
  }

  componentDidMount() {
    let teams = [];
    this.props.firebase.getTeams().then(snapshot => {
      snapshot.forEach(doc => {
        teams.push({ id: doc.id, ...doc.data() });
      });
      // SortedTeams is an array that sorts the teams' points in descending order
      const sortedTeams = [].concat(teams).sort((a, b) => a.points < b.points);
      this.setState({ allTeams: sortedTeams, isLoading: false });
    });
  }

  render() {
    //   places renders the Place object for each team in the correct order
    let places = this.state.allTeams
      .slice(0, this.state.shownNumber)
      .map((team, index) => (
        <Place
          rank={index + 1}
          teamName={team.name}
          teamNumber={team.number}
          points={team.points}
          key={team.id}
        />
      ));

    return (
      <View style={styles.container}>
        <View style={styles.ListView}>
          <View style={styles.ListTitleView}>
            <Text style={styles.ListTitle}> MORALE CUP STANDINGS </Text>
          </View>
          {!this.state.isLoading && (
            <>
              {/* Renders the top 3 teams from the 'places' variable */}
              {places}
              {/* Renders the 'show more/less' button and toggles the extended/collapsed leaderboard */}
              <TouchableHighlight
                onPress={() => {
                  this.setState({
                    shownNumber:
                      this.state.shownNumber == this.state.topNumber
                        ? this.state.allTeams.length
                        : this.state.topNumber
                  });
                }}
                underlayColor="#dddddd"
                style={styles.more}
              >
                <Text>
                  {/* Shows the appropriate message when the leaderboard is collapsed/extended */}
                  {this.state.shownNumber == this.state.topNumber
                    ? "Show more..."
                    : "Show less..."}
                </Text>
              </TouchableHighlight>
            </>
          )}
        </View>
        {this.state.isLoading && (
          <ActivityIndicator
            size="large"
            color="blue"
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: 20
            }}
          />
        )}
      </View>
    );
  }
}

export default withFirebaseHOC(Standings);
