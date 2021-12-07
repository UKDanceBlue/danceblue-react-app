import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Place from './Place';
import { globalColors } from '../../theme';

/**
 * Standings implementation for the a generic leaderboard
 * @param {array} standingData information to be displayed (defalt: blank)
 * @param {bool} expandable Can the standings be expanded/contracted (defalt: false)
 * @param {bool} expanded Are the standings expanded by default (defalt: false)
 * @param {number} collapsedRows How many rows should be shown when collapsed (default: 3)
 * @param {string} highlightedId The row ID to highlight, falsy for none (defalt: undefined)
 * @param {function} refreshCallback A function that can be called to refresh the component
 */
const Standings = ({
  standingData,
  expandable,
  startExpanded,
  collapsedRows = 3,
  highlightedId,
  refreshCallback,
}) => {
  const [rows, setRows] = useState([]);
  const [expanded, setExpanded] = useState(!!startExpanded);
  const [rowsToShow, setRowsToShow] = useState(collapsedRows);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    () => setRowsToShow(expanded ? standingData.length : collapsedRows),
    [expanded, standingData, collapsedRows]
  );

  useEffect(() => {
    setIsLoading(true);
    const sortedStandings = standingData;
    sortedStandings.sort((a, b) => b.points - a.points);
    const tempRows = [];
    for (let i = 0; i < sortedStandings.length && i < rowsToShow; i++) {
      tempRows.push(
        <Place
          key={sortedStandings[i].id}
          rank={i + 1}
          name={sortedStandings[i].name}
          points={sortedStandings[i].points}
          isHighlighted={highlightedId === sortedStandings[i].id}
        />
      );
    }
    setRows(tempRows);
    setIsLoading(false);
  }, [standingData, rowsToShow, highlightedId]);

  return (
    <View style={styles.container}>
      <View style={styles.ListView}>
        <View style={styles.ListTitleView}>
          {refreshCallback && (
            <TouchableOpacity
              style={styles.syncIcon}
              onPress={() => {
                refreshCallback();
                setIsLoading(true);
              }}
            >
              <FontAwesome5 name="sync" size={20} color={globalColors.dbBlue} />
            </TouchableOpacity>
          )}
        </View>
        {!isLoading && (
          <>
            {rows}
            {expandable &&
              (expanded ? (
                <TouchableOpacity onPress={() => setExpanded(false)}>
                  <Text>Show less...</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setExpanded(true)}>
                  <Text>Show more...</Text>
                </TouchableOpacity>
              ))}
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

export default Standings;
