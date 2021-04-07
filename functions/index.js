const functions = require("firebase-functions")

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin')
admin.initializeApp();

exports.checkScavengerHunt = functions.https.onRequest(async (req, res) => {
  const guess = req.body.guess
  const userID = req.body.userID
  const correct = '12345678910'

  if (guess === correct) {
    res.json({message: 'You deciphered the code! Congrats!', solved: true, userID: userID})
    var data = {
      image: '/badges/Scavenger Hunt Completion 21.png',
      timeEarned: admin.firestore.Timestamp.now(),
      name: 'Scavenger Hunt \'21'
    }
    admin.firestore().collection('users').doc(userID).collection('badges').doc('scavenger-hunt-21').set(data)
  } else {
    res.json({message: 'Sorry, your guess was wrong. The treasure remains hidden.', solved: false, userID: userID})
  }
})
