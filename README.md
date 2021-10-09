# Sign-Me-Up

`Sign me up` is an authorisation system for the unofficial IIIT Pune Discord.

- Hosted at [https://iiitp-discord.netlify.app/](https://iiitp-discord.netlify.app/).

- Built with React, Firebase, Node and Discord API.

### Setting Up Local Environment
1. Clone the repository.

2. Create a project on the firebase console.
    1. Add a `Web App` to the project.
    
    2. Copy the SDK configuration to a `.env` file to initialise the environment variables. 
        1. Prefix the field names with `REACT_APP`.
        2. Example: `REACT_APP_APIKEY = <some_api_key>`
        
    3. Enable Authentication for the firebase project. Add Google to the sign-in methods.
    
    4. Set up an `service account` in the project settings. 
        1. Download the `serviceAccountKey.json` file and replace the contents of [./server/serviceAccountKey.json](./server/serviceAccountKey.json).
3. Create a Discord Developers Account.
    1. Create an Application.
    
    2. Save the keys (Public and Client Secret) to the `.env` file.
    
    3. Change the redirect URI to the local port URI where your client app will be running. Example `http://localhost:5000`.
    
    4. Save the redirect URI to the `.env` file.
    
4. Start the Client App locally with `npm start`.

5. Install Nodemon as a global and dev dependancy. Start the Server App with `npx nodemon server.js`

### Contributing

1. Submit an Issue for Bugs or Feature Requests.
2. Set up the local environment.
3. Submit Pull Requests for the Assigned Issues.

