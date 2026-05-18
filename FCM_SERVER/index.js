const express = require("express");
const admin = require("firebase-admin");

const app = express();

app.use(express.json());

const serviceAccount =
require("./serviceAccountKey.json");

admin.initializeApp({
  credential:
  admin.credential.cert(serviceAccount)
});

app.post("/sendPush",
async (req, res) => {

    const token = req.body.token;

    const message = {

        token: token,

        data: {
            action: "wake"
        },

        android: {
            priority: "high"
        }
    };

    try {

        const response =
        await admin.messaging()
        .send(message);

        res.send({
            success: true,
            response: response
        });

    } catch (e) {

        res.send({
            success: false,
            error: e.toString()
        });
    }
});

app.listen(3000, () => {
    console.log("Server Running");
});