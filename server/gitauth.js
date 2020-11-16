const axios = require("node-fetch");
require("dotenv/config");

async function gitAuth(accessToken) {
    const clientID = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    // console.log(`access token: ${accessToken}`);

    res = await fetch("https://api.github.com/user", {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `token ${accessToken}`,
            },
        });

    userinfo = await res.json();

    return userinfo;
}

module.exports = gitAuth;