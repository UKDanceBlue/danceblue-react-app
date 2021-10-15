const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const fetch = require("node-fetch");

exports.sendPushNotification = functions.https.onRequest(async (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  const data = req.body.data;
  const ttl = req.body.ttl;

  let numDevices = 0;
  const tokens = [];
  let numBatches = 0;

  const dbRef = admin.firestore().collection("expo-push-tokens");

  await dbRef.get().then((snapshot) => {
    snapshot.forEach((doc) => {
      tokens.push(doc.data().token);
      numDevices++;
    });
    numBatches = Math.ceil(numDevices / 100);
    let devicesToGo = numDevices;
    for (let i = 0; i < numBatches; i++) {
      devicesToGo = numDevices - i * 100;
      const chunk = tokens.slice(i * 100, i * 100 + 100);
      fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Host": "exp.host",
          "Accept": "application/json",
          "Accept-Encoding": "application/gzip",
          "Content-Type": "application/json",
        },
        body:  JSON.stringify({
          to: chunk,
          title: title,
          body: body,
        }),
      })
    }
  });

  res.json({
    result: `Sent successfully to ${numDevices} devices in ${numBatches} batch(es)`,
  });
});

exports.checkScavengerHunt = functions.https.onRequest(async (req, res) => {
  const guess = req.body.guess;
  const userID = req.body.userID;
  const correct = "14753810629";

  const dbRef = admin
      .firestore()
      .collection("users")
      .doc(userID)
      .collection("badges")
      .doc("scavenger-hunt-21");

  await dbRef.get().then((doc) => {
    if (doc.exists) {
      res.json({
        message: "You have already solved this scavenger hunt.",
        userID: userID,
        solved: true,
      });
    } else {
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
        dbRef.set(data);
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
    }
  });
});
