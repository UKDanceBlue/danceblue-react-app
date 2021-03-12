// Standings implementation for the Morale Cup leaderboard
import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator
  , Dimensions
} from 'react-native'
import Place from './place'

import { withFirebaseHOC } from '../../../config/Firebase'

class Standings extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      allTeams: [],
      allUsers: [],
      allTeamsPPM: [], // PPM = points per member
      shownNumber: this.props.shownNumber | 3,
      topNumber: this.props.topNumber | 3,
      isLoading: true,
      showScoresByTeam: true,
      showPointsPerMember: false,
      userTeamNum: undefined,
      userID: undefined
    }
  }

  componentDidMount () {
    // Create arrays for team list, one for team total scores and one for team scores per member.
    const teams = []
    this.props.firebase.getTeams().then(snapshot => {
      snapshot.forEach(doc => {
        teams.push({ id: doc.id, ...doc.data() })
      })
      // SortedTeams is an array that sorts the teams' points in descending order
      const sortedTeams = [].concat(teams).sort((a, b) => a.points < b.points)
      const sortedTeamsPPM = [].concat(teams).sort((a, b) => (a.points / a.size) < (b.points / b.size))
      this.setState({ allTeams: sortedTeams, isLoading: false })
      this.setState({ allTeamsPPM: sortedTeamsPPM, isLoading: false })
    })

    // Get list of users, for switching scoreboard to display people instead of teams.
    const users = []
    this.props.firebase.getUsers().then(snapshot => {
      snapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() })
      })
      const sortedUsers = [].concat(users).sort((a, b) => a.points < b.points)
      this.setState({ allUsers: sortedUsers, isLoading: false })
    })
    // Get the team number and user ID of the current user.
    // These are for highlighting the user's position in the teams and users scoreboards
    this.props.firebase.checkAuthUser(user => {
      if (user) {
        this.props.firebase.getUserData(user.uid).then(data => {
          this.setState({ userTeamNum: data.data().teamNumber })
          this.setState({ userID: data.id })
        })
      }
    })
  }

  render () {
    // Creates places list for teams, which renders Place object for each team in order
    let places = []
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
            pointsPerMember={Math.floor(team.points / team.size * 10) / 10} // rounds to 1 decimal point
            isHighlighted={team.number === this.state.userTeamNum}
          />
        ))
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
        ))
    }

    // If scoreboard is showing people rather than teams,
    // Show top 10 users on scoreboard, with current user at bottom (if they're below 10th).
    if (!this.state.showScoresByTeam && places.length > 10) {
      let userPlace = new Place()
      let userPlaceRank
      for (let i = 0; i < places.length; i++) {
        if (places[i].key === this.state.userID) {
          userPlace = places[i]
          userPlaceRank = i
          break
        }
      }
      places = places.slice(0, 10)
      if (userPlaceRank > 10) {
        places = places.concat([userPlace])
      }
    }

    return (
      <View style={styles.container}>
        <View style={styles.ListView}>
          <View style={styles.ListTitleView}>
            <Text style={styles.ListTitle}> SPIRIT POINTS STANDINGS </Text>
          </View>
          {!this.state.isLoading && (
            <>
              <View style={styles.optionRow}>

                <View style={!this.state.showPointsPerMember && this.state.showScoresByTeam ? styles.highlightedOption : styles.option}>
                  {/* Button for toggling between Teams and People scoreboard */}
                  <TouchableHighlight
                    onPress={() => {
                      this.setState({
                        showPointsPerMember: false,
                        showScoresByTeam: true
                      })
                    }}
                    underlayColor='#dddddd'
                    style={styles.more}
                  >
                    <Text>
                      Team Totals
                    </Text>
                  </TouchableHighlight>
                </View>

                <View style={this.state.showPointsPerMember && this.state.showScoresByTeam ? styles.highlightedOption : styles.option}>
                  <TouchableHighlight
                    onPress={() => {
                      this.setState({
                        showPointsPerMember: true,
                        showScoresByTeam: true
                      })
                    }}
                    underlayColor='#dddddd'
                    style={styles.more}
                  >
                    <Text>
                      Total per Members
                    </Text>
                  </TouchableHighlight>
                </View>

                <View style={!this.state.showScoresByTeam ? styles.highlightedOption : styles.option}>
                  {/* Button for toggling between total scores and points per member */}
                  <TouchableHighlight
                    onPress={() => {
                      if (this.state.showScoresByTeam) { // only toggleable when showing teams
                        this.setState({
                          showScoresByTeam: false
                        })
                      }
                    }}
                    underlayColor='#dddddd'
                    style={styles.more}
                  >
                    <Text>
                      Student Scores
                    </Text>
                  </TouchableHighlight>
                </View>

              </View>
              {/* Renders the top shownNumber Places from the 'places' variable */}
              {places}
              {/* Renders the 'show more/less' button and toggles the extended/collapsed leaderboard */}
              <TouchableHighlight
                onPress={() => {
                  this.setState({
                    shownNumber:
                      this.state.shownNumber === this.state.topNumber
                        ? this.state.allTeams.length
                        : this.state.topNumber
                  })
                }}
                underlayColor='#dddddd'
                style={styles.more}
              >
                <Text>
                  {/* Shows the appropriate message when the leaderboard is collapsed/extended */}
                  {this.state.shownNumber === this.state.topNumber
                    ? 'Show more...'
                    : 'Show less...'}
                </Text>
              </TouchableHighlight>
            </>
          )}
        </View>
        {this.state.isLoading && (
          <ActivityIndicator
            size='large'
            color='blue'
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20
            }}
          />
        )}
      </View>
    )
  }
}

const { width } = Dimensions.get('window')
const colWidth = width / 3
const styles = StyleSheet.create({
  container: {
    width: '98%',
    marginBottom: 5,
    borderColor: '#FFC72C',
    borderWidth: 1,
    borderRadius: 15,
    overflow: 'hidden'
  },
  ListView: {
    paddingLeft: 5,
    marginTop: 5,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    flex: 1
  },
  ListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    borderBottomColor: '#0033A0',
    borderBottomWidth: 2
  },
  ListTitleView: {
    borderBottomColor: '#0033A0',
    borderBottomWidth: 2
  },
  more: {
    justifyContent: 'flex-end'
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: width,
    borderColor: '#63656a',
    borderWidth: 1,
    borderRadius: 30,
    overflow: 'hidden'
  },
  option: {
    width: colWidth,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center'
  },
  highlightedOption: {
    width: colWidth,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    backgroundColor: '#1897d4'
  }
})

export default withFirebaseHOC(Standings)
