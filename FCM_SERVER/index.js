const express = require("express");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://rto-1-4b543-default-rtdb.firebaseio.com"
});

const app = express();

app.get("/", (req, res) => {
  res.send("SERVER RUNNING");
});

app.get("/send/:id", async (req, res) => {

  try {

    const androidID = req.params.id;

    console.log("ID:", androidID);

    const snapshot = await admin.database()
      .ref("FCM/" + androidID)
      .once("value");

    console.log("SNAPSHOT:", snapshot.val());

    const token = snapshot.val();

    if (!token) {
      return res.send("TOKEN NOT FOUND");
    }

    const message = {
      data: {
        action: "wake"
      },
      token: token
    };

    const response =
      await admin.messaging().send(message);

    console.log(response);

    return res.send("Push Sent");

  } catch (e) {

    console.log(e);

    return res.send(e.toString());
  }

});

app.listen(process.env.PORT || 3000, () => {
  console.log("SERVER STARTED");
});
