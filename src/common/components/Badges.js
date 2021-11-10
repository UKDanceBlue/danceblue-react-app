import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';

import Badge from './Badge.js';

import { withFirebaseHOC } from '../../firebase/FirebaseContext';

/**
 * A row of a user's {@link Badge}s loaded from Firebase
 * @param {Object} props Properties of the component: (imageURL, name)
 */
const Badges = ({ userID, firestore }) => {
  //userID used to also be part of state, I couldn't find where that was used so I removed it, if this stops working; check there
  [badges, setBadges] = useState(true);
  [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedBadges = [];
    firestore.getUserBadges(userID).then((snapshot) => {
      snapshot.forEach((doc) => {
        loadedBadges.push(doc.data());
      });
      setBadges(loadedBadges);
      setIsLoading(false);
    });
  });

  return (
    <>
      {isLoading && <ActivityIndicator style={styles.image} size="large" color="blue" />}
      {!isLoading && (
        <>
          {badges.length === 0 ? (
            <Text>You currently have no badges. Check back later to see if you've earned any!</Text>
          ) : (
            <FlatGrid
              itemDimension={130}
              data={badges}
              spacing={10}
              renderItem={({ item }) => (
                <Badge name={item.name} imageURL={item.image} time={item.timeEarned} />
              )}
            />
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({});

export default withFirebaseHOC(Badges);
