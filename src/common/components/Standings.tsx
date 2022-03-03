/// <reference types="react" />
import React, { ReactElement, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-elements';
import Place from './Place';
import { globalColors, globalStyles, globalTextStyles } from '../../theme';
import { StandingType } from '../../types/StandingType';

/**
 * Standings implementation for the a generic leaderboard
 */
const Standings = ({
  titleText,
  standingData,
  expandable = false,
  startExpanded = false,
  collapsedRows = 3,
  lastRow,
  dadJokeTempMagic = false,
  dadJokeTempMagicCallback = () => {},
}: {
  titleText: string;
  standingData: StandingType[];
  expandable?: boolean;
  startExpanded?: boolean;
  showTrophies?: boolean;
  collapsedRows?: number;
  dadJokeTempMagic?: boolean;
  dadJokeTempMagicCallback?: (arg0: boolean, arg1: string) => unknown;
}) => {
  const [rows, setRows] = useState<ReactElement[]>([]);
  const [expanded, setExpanded] = useState<boolean>(!!startExpanded);
  const [rowsToShow, setRowsToShow] = useState<number>(collapsedRows);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(
    () => setRowsToShow(expanded ? standingData.length : collapsedRows),
    [expanded, standingData, collapsedRows]
  );

  useEffect(() => {
    setIsLoading(true);
    const sortedStandings = standingData.map((standing) => ({
      ...standing,
      points: standing.points || 0,
    }));
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
          lastRow={i === sortedStandings.length - 1 && i === rowsToShow - 1}
          dadJokeTempMagic={dadJokeTempMagic}
          dadJokeTempMagicCallback={(arg0: boolean) =>
            dadJokeTempMagicCallback(arg0, sortedStandings[i].id)
          }
        />
      );
    }
    setRows(tempRows);
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
