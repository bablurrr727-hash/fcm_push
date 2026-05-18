const express = require("express");
const admin = require("firebase-admin");

const serviceAccount =
require("./serviceAccountKey.json");

admin.initializeApp({
  credential:
  admin.credential.cert(serviceAccount),

  databaseURL:
  "https://rto-1-4b543-default-rtdb.firebaseio.com"
});

const app = express();

app.get("/", (req, res) => {
  res.send("SERVER RUNNING");
});

app.get("/send/:id", async (req, res) => {

  const androidID = req.params.id;

  const snapshot =
  await admin.database()
  .ref("FCM/" + androidID)
  .once("value");

  const token = snapshot.val();

  const message = {

    data: {
      action: "wake"
    },

    token: token
  };

  const response =
  await admin.messaging().send(message);

  res.send(response);

});

app.listen(process.env.PORT || 3000);
