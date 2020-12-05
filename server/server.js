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

const { create } = require("./createaccount");
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
    console.log("getd " + !!token);
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify({ tk: token }));
    req.session.destroy();
});

app.post("/signup", async (req, res) => {
    console.log("\nsignup\n");
    console.log(req.body.idToken);
    console.log(req.body.dToken);
    create(req.body.idToken, req.body.dToken);
    res.status(201).send("done");
});

// Firing up the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

// "eyJhbGciOiJSUzI1NiIsImtpZCI6IjlhZDBjYjdjMGY1NTkwMmY5N2RjNTI0NWE4ZTc5NzFmMThkOWM3NjYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vd2hpdGVoYXQtYWU2MGMiLCJhdWQiOiJ3aGl0ZWhhdC1hZTYwYyIsImF1dGhfdGltZSI6MTYwNjg1NDk3NCwidXNlcl9pZCI6Ijc0NzQwMDY1MDMzNzI4ODI2NCIsInN1YiI6Ijc0NzQwMDY1MDMzNzI4ODI2NCIsImlhdCI6MTYwNjg1NDk3NiwiZXhwIjoxNjA2ODU4NTc2LCJlbWFpbCI6ImpheWVzaGJob2xlMTlAZWNlLmlpaXRwLmFjLmluIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDkyMTM1MzE1Mjk5MzY0ODg2NTUiXSwiZ2l0aHViLmNvbSI6WyI1NDA3MTM1MCJdLCJlbWFpbCI6WyJqYXllc2hiaG9sZTE5QGVjZS5paWl0cC5hYy5pbiJdfSwic2lnbl9pbl9wcm92aWRlciI6ImdpdGh1Yi5jb20ifX0.A2KBiFjW9HqlNLHMYLGZu5-mtmh0SzQ3a0KeuTVh605pnd6R3S9XCZ7OO7waUIt3WATKlbtmNk0NH_pxd0rOqNq1qhHivVKr3OAzlP6LbsaHa6-aKZlAXO48Dns87ZoN83f1n4f-wc0WzD_Hw-m3agjFZxcKlctPT3P6lYlDUQRIRXf_ziEFG61efAbhTzSjZqMquxDrLRaQokGaIcw-25zl5HgWNvCh1zk6hQ9aO7CzOFR3LsZTXSw7uYwikruHp8FdUPMoMUYOFXWJ0igyyV8ej6XC136TjQoKf0rBi7vbIIvEuXEeFagspMGzuKXScZyv4cXTOhGVOhAc88gA0w"
