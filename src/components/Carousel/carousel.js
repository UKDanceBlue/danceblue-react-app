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
      <View style={styles.shadowsStyling}>
        <ScrollView ScrollEventThrottle={16}>
          <View style={styles.sponsorView}>
            <View style={styles.sponsorTitleView}>
              <Text style={styles.sponsorTitle}>SPONSORS</Text>
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
  sponsorView: {
    paddingLeft: 5,
    paddingTop: 5,
    paddingBottom: 5,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    flex: 1
  },
  sponsorTitle: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold"
  },
  sponsorTitleView: {
    borderBottomColor: "#0033A0",
    borderBottomWidth: 2
  },
  cardScrollView: {
    height: 170,
    marginTop: 5,
    padding: 5
  },
  shadowsStyling: {
    width: "95%",
    marginBottom: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: {
      height: 0,
      width: 0
    }
  }
});

export default withFirebaseHOC(Carousel);
