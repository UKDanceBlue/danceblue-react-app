// Standings implementation for the Morale Cup leaderboard
import React from "react";
import { Text, View, StyleSheet, TouchableHighlight } from "react-native";
import Place from "./place";

const styles = StyleSheet.create({
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
  shadowsStyling: {
    width: "95%",
    marginBottom: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  more: {
    justifyContent: "flex-end"
  }
});

const Teams = [
  { teamNumber: "Team 1", teamName: "A", points: 2 },
  { teamNumber: "Team 2", teamName: "B", points: 4 },
  { teamNumber: "Team 3", teamName: "C", points: 1 },
  { teamNumber: "Team 4", teamName: "D", points: 8 },
  { teamNumber: "Team 5", teamName: "E", points: 1 },
  { teamNumber: "Team 6", teamName: "F", points: 1 },
  { teamNumber: "Team 7", teamName: "G", points: 1 },
  { teamNumber: "Team 8", teamName: "H", points: 15 },
  { teamNumber: "Team 9", teamName: "I", points: 10 },
  { teamNumber: "Team 10", teamName: "J", points: 1 },
  { teamNumber: "Team 11", teamName: "K", points: 1 },
  { teamNumber: "Team 12", teamName: "L", points: 22 },
  { teamNumber: "Team 13", teamName: "M", points: 1 },
  { teamNumber: "Team 14", teamName: "N", points: 7 },
  { teamNumber: "Team 15", teamName: "O", points: 1 },
  { teamNumber: "Team 16", teamName: "P", points: 43 },
  { teamNumber: "Team 17", teamName: "Q", points: 1 },
  { teamNumber: "Team 18", teamName: "R", points: 1 },
  { teamNumber: "Team 19", teamName: "S", points: 99 },
  { teamNumber: "Team 20", teamName: "T", points: 50 },
  { teamNumber: "Team 21", teamName: "U", points: 1 },
  { teamNumber: "Team 22", teamName: "V", points: 1 },
  { teamNumber: "Team 23", teamName: "W", points: 3 },
  { teamNumber: "Team 24", teamName: "X", points: 20 }
];

class Standings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allTeams: [],
      shownNumber: this.props.shownNumber | 3,
      topNumber: this.props.topNumber | 3
    };
  }

  componentDidMount() { 
    // SortedTeams is an array that sorts the teams' points in descending order
    const sortedTeams = [].concat(Teams).sort((a, b) => a.points < b.points);
    this.setState({ allTeams: sortedTeams });
  }

  render() {
    //   places renders the Place object for each team in the correct order
    let places = this.state.allTeams
      .slice(0, this.state.shownNumber)
      .map((item, index) => (
        <Place
          rank={index + 1}
          teamName={item.teamName}
          teamNumber={item.teamNumber}
          points={item.points}
        />
      ));

    return (
      <View style={styles.shadowsStyling}>
        <View style={styles.ListView}>
          <Text style={styles.ListTitle}>MORALE CUP STANDINGS</Text>
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
                    ? 'Show more...' : 'Show less...'}
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default Standings;
