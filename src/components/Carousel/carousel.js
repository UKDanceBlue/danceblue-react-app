import React from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import Card from "./card";

import { withFirebaseHOC } from "../../../config/Firebase";

class Carousel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sponsors: []
    };
  }

  componentDidMount() {
    let dbSponsors = [];
    this.props.firebase.getSponsors().then(snapshot => {
      snapshot.forEach(doc => {
        dbSponsors.push({ ...doc.data(), id: doc.id });
      });
      this.setState({ sponsors: dbSponsors });
    });
  }

  render() {
    let cards = this.state.sponsors.map((sponsor, index) => (
      <Card
        imageLink={sponsor.logo}
        sponsorLink={sponsor.link}
        key={sponsor.id}
      />
    ));

    return (
      <View style={styles.container}>
        <ScrollView ScrollEventThrottle={16}>
          <View style={styles.sponsorView}>
            <View style={styles.sponsorTitleView}>
              <Text style={styles.sponsorTitle}> SPONSORS </Text>
            </View>
            <View style={styles.cardScrollView}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ padding: 10 }}
              >
                {cards}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "98%",
    marginBottom: 10,
    borderWidth:1,
    borderColor:'gold',
    borderRadius:15,
    overflow:"hidden",
    padding:5,
  },
  sponsorView: {
    paddingVertical:5,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "white",
    flex: 1
  },
  sponsorTitle: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  sponsorTitleView: {
    borderBottomColor: "#0033A0",
    borderBottomWidth: 2,
  },
  cardScrollView: {
    height: 170,
    marginTop: 5,
  },
});

export default withFirebaseHOC(Carousel);
