require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
require("./db");
const user = require("./models/userSchema");

var admin = require("firebase-admin");
const serviceAccountKey = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
});

const g = require("./gauth");
const d = require("./dauth");

const app = express();

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
    res.redirect(d.discordAuthUrl("harsh"));
});

app.get("/discordauth", async (req, res) => {
    const resObject = await d.discordAuth(req.query.state, req.query.code);
    req.session.jwt = await resObject.jwt;
    res.redirect(`http://localhost:3000/login/d`);
});

app.get("/getd", async (req, res) => {
    const token = req.session.jwt;
    console.log(!!token);
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify({ tk: token }));
    req.session.destroy();
});

// app.post("/login/c", (req, res) => {});
// Completed registration. Add to server with roles
app.get("/token", (req, res) => {
    admin
        .auth()
        .verifyIdToken("")
        .then(function (decodedToken) {
            let uid = decodedToken.uid;
            console.log(decodedToken);
            res.send(uid);
        })
        .catch(function (error) {
            // Handle error
        });
});

// Firing up the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
