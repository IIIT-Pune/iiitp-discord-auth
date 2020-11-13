require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
require("./db");
const user = require('./models/userSchema');

const cors = require("cors");
const app = express();

const g = require("./gauth");
const d = require("./dauth");

app.use(cors());
app.use(express.json());

app.post("/googleauth", async (req, res) => {
    // access_token=req.body.access_token;
    // refresh_token=req.body.refresh_token;
    r = await g.verify({
        access_token: req.body.gat,
        refresh_token: req.body.grt,
    });
    console.log(r);
    await user.find({gooogleEmail: r.email},(err,data)=>{
        if(!data){
            
        }
    })
    res.send(r);
});

app.get("/dauthurl",(req,res) => {
    res.redirect(d.discordAuthUrl('harsh'));
})

app.get("/discordauth", (req,res) => {
    userinfo =  d.discordAuth(req.body.state, req.body.code);
    console.log(req.body.state, req.body.code);
    res.header("content-type: application/json")
    res.send(JSON.stringify(userinfo));
})

// Firing up the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
