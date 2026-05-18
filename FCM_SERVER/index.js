app.get("/send/:id", async (req, res) => {

  try {

    const androidID = req.params.id;

    console.log("ID:", androidID);

    const snapshot = await admin.database()
      .ref("FCM/" + androidID)
      .once("value");

    console.log("SNAPSHOT:", snapshot.val());

    return res.send("STEP 1 OK");

  } catch (e) {

    console.log(e);

    return res.send(e.toString());
  }

});
