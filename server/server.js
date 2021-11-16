require("dotenv/config");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");

var admin = require("firebase-admin");
const serviceAccountKey = {
    type: "service_account",
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.CERT_URL,
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
});

const { create } = require("./createaccount");
const d = require("./dauth");

const app = express();

// app.use(
//     cors({ credentials: true, origin: "https://iiitp-discord.netlify.app" })
// );
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: { maxAge: 86400000 },
    })
);

app.get("/dauthurl", (req, res) => {
    res.redirect(d.discordAuthUrl(req.sessionID));
});

app.get("/discordauth", async (req, res) => {
    const resObject = await d.discordAuth(req.query.code);
    req.session.jwt = await resObject.jwt;
    res.redirect(`http://localhost:3000/d`);
});

app.get("/getd", async (req, res) => {
    const token = req.session.jwt;
    console.log("getd " + !!token);
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify({ tk: token }));
    req.session.destroy();
});

app.post("/signup", async (req, res) => {
    console.log("\nsignup\n");
    create(req.body.idToken, req.body.dToken);
    res.status(201).send("done");
});

// Firing up the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
