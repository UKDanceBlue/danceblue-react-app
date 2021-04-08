const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

exports.checkScavengerHunt = functions.https.onRequest(async (req, res) => {
  const guess = req.body.guess;
  const userID = req.body.userID;
  const correct = "14753810629";

  if (guess === correct) {
    res.json({
      message: "You deciphered the code! Congrats!",
      solved: true,
      userID: userID,
    });
    const now = admin.firestore.Timestamp.now();
    const data = {
      image: "/badges/Scavenger Hunt Completion 21.png",
      timeEarned: now,
      name: "Scavenger Hunt '21",
    };
    admin
        .firestore()
        .collection("users")
        .doc(userID)
        .collection("badges")
        .doc("scavenger-hunt-21")
        .set(data);
    admin
        .firestore()
        .collection("scavenger-hunt-21")
        .add({
          timeEarned: now,
          userID: userID,
        });
  } else {
    res.json({
      message: "Sorry, your guess was wrong. The treasure remains hidden.",
      solved: false,
      userID: userID,
    });
  }
});
