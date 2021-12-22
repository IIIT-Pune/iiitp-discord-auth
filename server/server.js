require("dotenv/config");
const express = require("express");
const cors = require("cors");
const create = require("./createaccount");

const app = express();

app.use(cors({ origin: "https://iiitpauth.netlify.app" }));
app.use(express.json());

app.post("/discordauth", async (req, res) => {
    console.log("\nsignup\n");
    const code = req.body.code;
    const firebaseToken = req.body.idToken;
    await create(firebaseToken, code);
    res.status(201).send("done");
});

// Firing up the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
