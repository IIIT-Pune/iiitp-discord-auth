import React, { Component } from "react";
import { Redirect } from "react-router";
import { axios } from "axios";
import "dotenv/config";

class GitAuth extends Component {
    constructor(props) {
        super(props);
        this.state = { redirect: false };
    }

    componentDidMount() {
        const clientID = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const oauth = async (ctx) => {
            const requestToken = ctx.request.query.code;
            const discord_id = ctx.request.query.id;

            console.log(
                "authorization code:",
                requestToken,
                " Id: ",
                discord_id
            );

            const tokenResponse = await axios({
                method: "post",
                url:
                    "https://github.com/login/oauth/access_token?" +
                    `client_id=${clientID}&` +
                    `client_secret=${clientSecret}&` +
                    `code=${requestToken}`,
                headers: {
                    accept: "application/json",
                },
            });

            const accessToken = tokenResponse.data.access_token;
            console.log(`access token: ${accessToken}`);

            const result = await axios({
                method: "get",
                url: `https://api.github.com/user`,
                headers: {
                    accept: "application/json",
                    Authorization: `token ${accessToken}`,
                },
            });
            console.log("user data: ", result.data);
            // const name = result.data.name;

            // ctx.response.redirect(`/welcome.html?name=${name}`);
        };
        setTimeout(() => {
            this.setState({ redirect: true });
        }, 5000);
    }
    render() {
        return (
            <div className="gitAuth">
                {this.state.redirect ? (
                    // <Redirect to="/" />
                    <span>Meh</span>
                ) : (
                    <div>
                        Login Successful. Return to the <a href="/">home</a>{" "}
                        screen if you are not redirected in 5 seconds.
                    </div>
                )}
                <span>Hi</span>
            </div>
        );
    }
}

export default GitAuth;
