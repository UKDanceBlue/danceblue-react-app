// Import third-party dependencies
import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

// Import first-party dependencies
import Place from './Place';
import { withFirebaseHOC } from '../../firebase/FirebaseContext';

/**
 * Standings implementation for the Morale Cup leaderboard
 * @param {number} rowsToShowDefault How many rows should be shown by default
 * @param {number} topNumber What is the threshold for "top" if in person mode instead of teams
 * @param {bool} isExpanded Are the standings expanded
 * @param {bool} isExpandable Should there be a button to expand the standings [CURRENTLY BORKED]
 */
const Standings = ({
  rowsToShowDefault,
  topNumber,
  isExpanded,
  isExpandable,
  navigate,
  firestore,
  auth,
}) => {
  const [allTeams, setAllTeams] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allTeamsPPM, setAllTeamPPM] = useState([]); // PPM = points per member
  const [rowsToShow, setRowsToShow] = useState(rowsToShowDefault ?? 3);
  const [isLoading, setIsLoading] = useState(true);
  const [showScoresByTeam, setShowScoresByTeam] = useState(true);
  const [showPointsPerMember, setShowPointsPerMember] = useState(false);
  const [userTeamNum, setUserTeamNum] = useState(undefined);
  const [userID, setUserID] = useState(undefined);

  /**
   * Loads teams from Firebase and then stores them into allTeams and their points into allTeamsPPm
   * @returns Teams loaded from Firebase
   */
  const loadTeams = useCallback(() => {
    const teams = [];
    return firestore.getTeams().then((snapshot) => {
      snapshot.forEach((doc) => {
        teams.push({ id: doc.id, ...doc.data() });
      });
      // SortedTeams is an array that sorts the teams' points in descending order
      const sortedTeams = [].concat(teams).sort((a, b) => a.points < b.points);
      const sortedTeamsPPM = [].concat(teams).sort((a, b) => a.points / a.size < b.points / b.size);
      setAllTeams(sortedTeams);
      setAllTeamPPM(sortedTeamsPPM);
      if (isExpanded) {
        setRowsToShow(sortedTeams.length);
      }
    });
  }, [firestore, isExpanded]);

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   */
  useEffect(() => {
    // Create arrays for team list, one for team total scores and one for team scores per member.
    const promises = [];

    promises.push(loadTeams());

    // Get list of users, for switching scoreboard to display people instead of teams.
    const users = [];
    promises.push(
      firestore.getUsersWithPoints().then((snapshot) => {
        snapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });
        const sortedUsers = [].concat(users).sort((a, b) => a.points < b.points);
        setAllUsers(sortedUsers);
      })
    );

    // Get the team number and user ID of the current user.
    // These are for highlighting the user's position in the teams and users scoreboards
    auth.checkAuthUser((user) => {
      if (user !== null) {
        if (!user.isAnonymous) {
          promises.push(
            firestore.getUser(user.uid).then((data) => {
              if (data?.data().teamNumber) {
                setUserTeamNum(data.data().teamNumber);
              }
              setUserID(data?.id);
            })
          );
        }
      }
    });

    // Display loading indicator until all promises resolve
    Promise.all(promises).then(setIsLoading(false));
  }, [auth, firestore, loadTeams]);

  // Creates places list for teams, which renders Place object for each team in order
  let places = [];
  if (showScoresByTeam) {
    places = (showPointsPerMember ? allTeamsPPM : allTeams)
      .slice(0, rowsToShow)
      .map((team, index) => (
        <Place
          rank={index + 1}
          teamName={team.name}
          teamNumber={team.number}
          points={team.points}
          key={team.id}
          size={team.size}
          showScoresByTeam={showScoresByTeam}
          showPointsPerMember={showPointsPerMember}
          pointsPerMember={Math.floor((team.points / team.size) * 10) / 10} // rounds to 1 decimal point
          isHighlighted={team.number === userTeamNum}
        />
      ));
    // Creates places list for people, which renders Place object for each user in order
  } else {
    places = allUsers
      .slice(0, rowsToShow)
      .map((user, index) => (
        <Place
          rank={index + 1}
          teamName={user.name}
          teamNumber={user.teamNumber}
          points={user.points}
          key={user.id}
          size={1}
          showPerMember={showPointsPerMember}
          pointsPerMember={user.points}
          isHighlighted={user.id === userID}
        />
      ));
  }

  // If scoreboard is showing people rather than teams,
  // Show top users on scoreboard, with current user at bottom (if they're below topNumber).
  // topNumber is 10 if topNumber is undefined
  if (!showScoresByTeam && places.length > (topNumber ?? 10)) {
    let userPlace = new Place();
    let userPlaceRank;
    for (let i = 0; i < places.length; i++) {
      if (places[i].key === userID) {
        userPlace = places[i];
        userPlaceRank = i;
        break;
      }
    }
    places = places.slice(0, topNumber ?? 10);
    if (userPlaceRank > (topNumber ?? 10)) {
      places = places.concat([userPlace]);
    }
  }

  let expandButton = null;
  if (isExpandable) {
    expandButton = (
      <TouchableHighlight
        onPress={() => {
          navigate('Scoreboard');
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
          <TouchableHighlight style={styles.syncIcon} onPress={() => loadTeams()}>
            <Icon name="sync" size={20} color="#0033A0" />
          </TouchableHighlight>
        </View>
        {!isLoading && (
          <>
            {/* Renders the top shownNumber Places from the 'places' variable */}
            {places}
            {expandButton}
          </>
        )}
      </View>
      {isLoading && (
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
};

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
