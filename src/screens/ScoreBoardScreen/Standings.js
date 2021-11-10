// Import third-party dependencies
import React from 'react';
import { Text, View, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

// Import first-party dependencies
import Place from './Place';
import { withFirebaseHOC } from '../../firebase/FirebaseContext';

/**
 * Standings implementation for the Morale Cup leaderboard
 * @param {Object} props Properties of the component: shownNumber, topNumber, isExpanded, isExpandable, navigate(), firebase
 *
 * TODO figure out how this works and then:
 *  1. Simplify it
 *  2. Add inline comments
 *  3. Make it a function component if possible
 */
class Standings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allTeams: [],
      allUsers: [],
      allTeamsPPM: [], // PPM = points per member
      shownNumber: this.props.shownNumber | 3,
      topNumber: this.props.topNumber | 3,
      isExpanded: this.props.isExpanded | false,
      isExpandable: this.props.isExpandable | false,
      isLoading: true,
      showScoresByTeam: true,
      showPointsPerMember: false,
      userTeamNum: undefined,
      userID: undefined,
    };

    this.loadTeams = this.loadTeams.bind(this);
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   */
  componentDidMount() {
    // Create arrays for team list, one for team total scores and one for team scores per member.
    const promises = [];

    promises.push(this.loadTeams());

    // Get list of users, for switching scoreboard to display people instead of teams.
    const users = [];
    promises.push(
      this.props.firestore.getUsersWithPoints().then((snapshot) => {
        snapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });
        const sortedUsers = [].concat(users).sort((a, b) => a.points < b.points);
        this.setState({ allUsers: sortedUsers });
      })
    );

    // Get the team number and user ID of the current user.
    // These are for highlighting the user's position in the teams and users scoreboards
    this.props.auth.checkAuthUser((user) => {
      if (user !== null) {
        if (!user.isAnonymous) {
          promises.push(
            this.props.firestore.getUser(user.uid).then((data) => {
              if (data.data().teamNumber) this.setState({ userTeamNum: data.data().teamNumber });
              this.setState({ userID: data.id });
            })
          );
        }
      }
    });

    // Display loading indicator until all promises resolve
    Promise.all(promises).then(this.setState({ isLoading: false }));
  }

  /**
   * Loads teams from Firebase and then stores them into this.state
   * @returns Teams loaded from Firebase
   */
  loadTeams() {
    const teams = [];
    let { shownNumber } = this.state;
    return this.props.firestore.getTeams().then((snapshot) => {
      snapshot.forEach((doc) => {
        teams.push({ id: doc.id, ...doc.data() });
      });
      // SortedTeams is an array that sorts the teams' points in descending order
      const sortedTeams = [].concat(teams).sort((a, b) => a.points < b.points);
      const sortedTeamsPPM = [].concat(teams).sort((a, b) => a.points / a.size < b.points / b.size);
      if (this.state.isExpanded) shownNumber = sortedTeams.length;
      this.setState({ allTeams: sortedTeams, allTeamsPPM: sortedTeamsPPM, shownNumber });
    });
  }

  /**
   * Called to generate a React Native component
   * @returns A JSX formatted component
   */
  render() {
    // Creates places list for teams, which renders Place object for each team in order
    let places = [];
    if (this.state.showScoresByTeam) {
      places = (this.state.showPointsPerMember ? this.state.allTeamsPPM : this.state.allTeams)
        .slice(0, this.state.shownNumber)
        .map((team, index) => (
          <Place
            rank={index + 1}
            teamName={team.name}
            teamNumber={team.number}
            points={team.points}
            key={team.id}
            size={team.size}
            showScoresByTeam={this.state.showScoresByTeam}
            showPointsPerMember={this.state.showPointsPerMember}
            pointsPerMember={Math.floor((team.points / team.size) * 10) / 10} // rounds to 1 decimal point
            isHighlighted={team.number === this.state.userTeamNum}
          />
        ));
      // Creates places list for people, which renders Place object for each user in order
    } else {
      places = this.state.allUsers
        .slice(0, this.state.shownNumber)
        .map((user, index) => (
          <Place
            rank={index + 1}
            teamName={user.name}
            teamNumber={user.teamNumber}
            points={user.points}
            key={user.id}
            size={1}
            showPerMember={this.state.showPointsPerMember}
            pointsPerMember={user.points}
            isHighlighted={user.id === this.state.userID}
          />
        ));
    }

    // If scoreboard is showing people rather than teams,
    // Show top 10 users on scoreboard, with current user at bottom (if they're below 10th).
    if (!this.state.showScoresByTeam && places.length > 10) {
      let userPlace = new Place();
      let userPlaceRank;
      for (let i = 0; i < places.length; i++) {
        if (places[i].key === this.state.userID) {
          userPlace = places[i];
          userPlaceRank = i;
          break;
        }
      }
      places = places.slice(0, 10);
      if (userPlaceRank > 10) {
        places = places.concat([userPlace]);
      }
    }

    let expandButton = null;
    if (this.state.isExpandable) {
      expandButton = (
        <TouchableHighlight
          onPress={() => {
            this.props.navigate('Scoreboard');
          }}
          underlayColor="#dddddd"
          style={styles.more}
        >
          <Text>Show more...</Text>
        </TouchableHighlight>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.ListView}>
          <View style={styles.ListTitleView}>
            <Text style={styles.ListTitle}>MORALE POINTS STANDINGS </Text>
            <TouchableHighlight style={styles.syncIcon} onPress={() => this.loadTeams()}>
              <Icon name="sync" size={20} color="#0033A0" />
            </TouchableHighlight>
          </View>
          {!this.state.isLoading && (
            <>
              {/* Renders the top shownNumber Places from the 'places' variable */}
              {places}
              {expandButton}
            </>
          )}
        </View>
        {this.state.isLoading && (
          <ActivityIndicator
            size="large"
            color="blue"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ListView: {
    paddingLeft: 5,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    flex: 1,
  },
  ListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 3,
  },
  ListTitleView: {
    flex: 1,
    flexDirection: 'row',
    width: '98%',
  },
  syncIcon: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  more: {
    justifyContent: 'flex-end',
  },
});

export default withFirebaseHOC(Standings);
