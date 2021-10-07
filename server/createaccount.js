const fetch = require("node-fetch");
var admin = require("firebase-admin");

module.exports = {
    create: async function (idToken, dToken) {
        roles = [
            ["708646465270054953", "773547829788016732", "698163473909284927"],
            ["697802364857352302", "773547829788016732", "698163445924888606"],
            ["697802598564102295", "773547829788016732", "698163413838200843"],
            ["697802667497619536", "773547829788016732", "698163194128105492"],
        ];

        let userClaims = null;
        await admin
            .auth()
            .verifyIdToken(idToken)
            .then((claims) => {
                userClaims = claims;
            })
            .catch((error) => console.log(error));
        console.log(userClaims);

        admin
            .auth()
            .getUser(userClaims.uid)
            .then(async (userrecord) => {
                console.log(userrecord);

                res = await fetch("https://discordapp.com/api/v8/users/@me", {
                    method: "GET",
                    headers: {
                        authorization: `Bearer ${dToken}`,
                    },
                });

                userinfo = await res.json(); //id,username,discriminator
                console.log(userinfo);

                const guildid = "694190268424912936";
                batch =
                    20 -
                    userrecord.providerData[0].email.split("@")[0].slice(-2);
                res = await fetch(
                    "https://discordapp.com/api/v8/guilds/" +
                        guildid +
                        "/members/" +
                        userinfo.id,
                    {
                        method: "PUT",
                        body: JSON.stringify({
                            access_token: dToken,
                            nick: userrecord.providerData[0].displayName,
                            roles: roles[batch],
                        }),
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bot ` + process.env.DISCORD_TOKEN,
                        },
                    }
                );
                console.log(res);
                if (res.status === 204) {
                    fetch(
                        "https://discordapp.com/api/v8/guilds/" +
                            guildid +
                            "/members/" +
                            userinfo.id,
                        {
                            method: "PATCH",
                            body: JSON.stringify({
                                nick: userrecord.providerData[0].displayName,
                                roles: roles[batch],
                            }),
                            headers: {
                                "Content-Type": "application/json",
                                Authorization:
                                    `Bot ` + process.env.DISCORD_TOKEN,
                            },
                        }
                    )
                        .then(console.log)
                        .catch(console.log);
                }
            })
            .catch((error) => console.log(error));
    },
};
