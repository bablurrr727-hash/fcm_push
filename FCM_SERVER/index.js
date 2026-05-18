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

  try {

    const androidID = req.params.id;

    console.log("DEVICE ID:", androidID);

    const snapshot = await admin.database()
      .ref("FCM/" + androidID)
      .once("value");

    const token = snapshot.val();

    console.log("TOKEN:", token);

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

    res.send(response);

  } catch (e) {

    console.log(e);

    res.send(e.toString());
  }

});

app.listen(process.env.PORT || 3000);
