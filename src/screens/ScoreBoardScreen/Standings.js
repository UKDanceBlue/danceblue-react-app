import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Place from './Place';
import { globalColors, globalStyles, globalTextStyles } from '../../theme';

/**
 * Standings implementation for the a generic leaderboard
 * @param {function} standingData an array of the information to be displayed (defalt: blank)
 * @param {bool} expandable Can the standings be expanded/contracted (defalt: false)
 * @param {bool} expanded Are the standings expanded by default (defalt: false)
 * @param {number} collapsedRows How many rows should be shown when collapsed (default: 3)
 */
const Standings = ({ standingData, expandable, startExpanded, collapsedRows = 3 }) => {
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
          isHighlighted={sortedStandings[i].highlighted}
        />
      );
      setRows(tempRows);
    }
    setIsLoading(false);
  }, [standingData, rowsToShow]);

  return (
    <View style={globalStyles.genericView}>
      <View style={localStyles.ListView}>
        {!isLoading && (
          <>
            {rows}
            {expandable &&
              (expanded ? (
                <TouchableOpacity onPress={() => setExpanded(false)}>
                  <Text style={globalTextStyles.italicText}>Show less...</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setExpanded(true)}>
                  <Text style={globalTextStyles.italicText}>Show more...</Text>
                </TouchableOpacity>
              ))}
          </>
        )}
      </View>
      {isLoading && (
        <ActivityIndicator
          size="large"
          color={globalColors.lightBlue}
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

const localStyles = StyleSheet.create({
  ListView: {
    paddingLeft: 5,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    flex: 1,
  },
});

export default Standings;
