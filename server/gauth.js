// const { google } = require("googleapis");
const fetch = require("node-fetch");

// const oauth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     process.env.GOOGLE_REDIRECT_URL
// );

const scopes = ["https://www.googleapis.com/auth/userinfo.profile"];

module.exports = {
    getUrl: async function () {
        // return oauth2Client.generateAuthUrl({
        //     access_type: "offline",
        //     prompt: "consent",
        //     scope: scopes, // If you only need one scope you can pass it as string
        // });
    },
    verify: async function (tokens) {
        // oauth2Client.setCredentials(tokens);
        console.log(tokens);

        res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            method: "GET",
            headers: {
                authorization: `Bearer ${tokens.access_token}`,
            },
        });

        userinfo = await res.json(); //id,username,discriminator
        console.log(userinfo);
        let x = userinfo.email.split("@")[0];
        let y = userinfo.email.split("@")[1];
        if (
            isNaN(x.slice(-2)) ||
            !["cse.iiitp.ac.in", "ece.iiitp.ac.in"].includes(y)
        ) {
            // Wrong match
            return false;
        } else {
            return userinfo;
        }
    },
};
