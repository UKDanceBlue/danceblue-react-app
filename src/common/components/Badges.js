import React from 'react';
import { Text } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';

import Badge from './Badge';

/**
 * A row of a user's {@link Badge}s loaded from Firebase
 * @param {Object} props Properties of the component: (imageURL, name)
 */
const Badges = ({ badges }) => (
  <>
    {badges.length === 0 ? (
      <Text>You currently have no badges. Check back later to see if you&apos;ve earned any!</Text>
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
);

export default Badges;
