const { differenceInYears } = require("date-fns");

const fetch = require("node-fetch");
const { admin, getUserClaims, getUser } = require("./admin");
const { Octokit } = require("@octokit/core");
const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

const getDiscordToken = async (code) => {
    // get o-auth token from code
    const data = {
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: "https://iiitpauth.netlify.app/",
        code: code,
        scope: "email identify guilds guilds.join",
    };

    let token = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        body: new URLSearchParams(data),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    token = await token.json();
    console.log("discord token : ", token);
    return token;
};

const getDiscordUser = async (dToken) => {
    return await fetch("https://discordapp.com/api/v8/users/@me", {
        method: "GET",
        headers: {
            authorization: `${dToken.token_type} ${dToken.access_token}`,
        },
    }).then((res) => res.json()); //id,username,discriminator
};

const getRolesArray = (startYear) => {
    const curYear =
        1 + differenceInYears(new Date(), new Date(`20${startYear}-06-01`));
    const baseRole = "773547829788016732";
    const roles = {
        18: "698163413838200843",
        19: "698163445924888606",
        20: "698163473909284927",
        21: "922873851598221354",
    };
    const year = {
        1: "708646465270054953", // Fresher role ID
        2: "697802364857352302", // Sophomore role ID
        3: "697802598564102295", // Junior role ID
        4: "697802667497619536", // Senior role ID
    };
    return [baseRole, roles[startYear], year[curYear]];
};

const create = async function (idToken, code) {
    const dToken = await getDiscordToken(code);
    const dUser = await getDiscordUser(dToken);

    const userClaims = await getUserClaims(idToken);
    const uid = userClaims.uid;

    const gUser = await getUser(uid);

    const batch = gUser.providerData[0].email.split("@")[0].slice(-2);
    const roles = getRolesArray(batch);

    await octokit.request("POST /orgs/IIIT-Pune/invitations", {
        org: "IIIT-Pune",
        email: gUser.providerData[1].email,
    });

    console.log(userClaims, uid, gUser);
    console.log(dUser); //id,username,discriminator

    const guildid = "694190268424912936";

    res = await fetch(
        `https://discordapp.com/api/v8/guilds/${guildid}/members/${dUser.id}`,
        {
            method: "PUT",
            body: JSON.stringify({
                access_token: dToken.access_token,
                nick: gUser.providerData[0].displayName,
                roles: roles,
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bot ` + process.env.DISCORD_TOKEN,
            },
        }
    ).then(async (res) => {
        await admin
            .auth()
            .setCustomUserClaims(uid, {
                discord_id: dUser.id,
                discord_refresh_token: dToken.refresh_token,
            })
            .catch((err) =>
                console.log("error occured while setting claims", err)
            );
        return res;
    });
    console.log("added to server response", res);
    if (res.status === 204) {
        fetch(
            `https://discordapp.com/api/v8/guilds/${guildid}/members/${dUser.id}`,
            {
                method: "PATCH",
                body: JSON.stringify({
                    nick: gUser.providerData[0].displayName,
                    roles: roles,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bot ` + process.env.DISCORD_TOKEN,
                },
            }
        )
            .then(async (res) => {
                console.log(res);
            })
            .catch(console.log);
    }
};

// export default create;
module.exports = create;
