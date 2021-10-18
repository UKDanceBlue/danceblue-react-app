import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

/**
 * TODO
 * @param {Object} props Properties of the component: (TODO)
 * @returns A React Native component
 * @author Kenton Carrier
 * @since 1.0.1
 * @class
 */
class Place extends React.Component {
  /**
   * Called to generate a React Native component
   * @returns A JSX formatted component
   */
  render () {
    // The 'top3Icon function adds an award icon to the top 3 teams
    const top3Icon = rank => {
      if (rank === 1) {
        return <Icon name='award' size={30} color='gold' />
      } else if (rank === 2) {
        return <Icon name='award' size={30} color='silver' />
      } else if (rank === 3) {
        return <Icon name='award' size={30} color='blue' />
      }
    }
    return (
      // Renders the individual row of the leaderboard for each team
      <View style={
        this.props.isHighlighted
          ? styles.highlightedRow
          : styles.row
        }
      >
        <View style={styles.left}>
          <Text style={styles.place}>
            {/* Renders the rank/place of the team */}
            {this.props.rank}
          </Text>
          {/* Calls the top3Icon function */}
          {top3Icon(this.props.rank)}
        </View>
        <View style={styles.middle}>
          <Text style={styles.name}>
            {/* Renders the team name */}
            {this.props.teamName}
          </Text>
          <Text style={styles.team}>
            {/* Renders the team number */}
            {this.props.teamNumber}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.bold}>
            {/* Renders the number of points earned */}
            {this.props.showPointsPerMember
              ? this.props.pointsPerMember < 1
                  ? '< 1 '
                  : this.props.pointsPerMember
              : this.props.points}
            {this.props.showPointsPerMember
              ? ' points'
              : this.props.points === 1
                ? ' point'
                : ' points'}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.2,
    borderBottomColor: '#999999'
  },
  highlightedRow: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.2,
    borderBottomColor: '#999999',
    backgroundColor: '#ffffc8'
  },
  left: {
    width: '20%',
    flexDirection: 'row'
  },
  right: {
    width: '30%',
    justifyContent: 'flex-end'
  },
  middle: {
    width: '50%',
    flexDirection: 'column'
  },
  place: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10
  },
  bold: {
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 10,
    fontSize: 17
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15
  },
  team: {
    fontWeight: 'normal',
    fontStyle: 'italic'
  }
})

export default Place
