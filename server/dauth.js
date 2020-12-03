var admin = require("firebase-admin");
const fetch = require("node-fetch");
require("dotenv/config");
module.exports = {
    discordAuthUrl: function (id) {
        return (
            "https://discord.com/api/oauth2/authorize?client_id=" +
            process.env.DISCORD_CLIENT_ID +
            "&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fdiscordauth&response_type=code&scope=email%20identify%20guilds%20guilds.join&state=" +
            id
        );
    },

    discordAuth: async function (id, code) {
        const data = {
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: "authorization_code",
            redirect_uri: "http://localhost:5000/discordauth",
            code: code,
            scope: "email identify guilds guilds.join",
        };

        let info = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            body: new URLSearchParams(data),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        info = await info.json();
        // console.log(info);

        res = await fetch("https://discordapp.com/api/v8/users/@me", {
            method: "GET",
            headers: {
                authorization: `${info.token_type} ${info.access_token}`,
            },
        });
        userinfo = await res.json(); //id,username,discriminator
        console.log(userinfo);

        let customTokenRes = null;
        await admin
            .auth()
            .createCustomToken(userinfo.id, {
                provider: "discord.com",
                name: userinfo.email,
                discord: true,
                discordAccessToken: info.access_token,
            })
            .then((customToken) => {
                customTokenRes = customToken;
                // console.log(customToken);
            })
            .catch((error) => console.log("Firebase error", error));

        return { user: userinfo, jwt: customTokenRes };
    },
};
