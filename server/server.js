require("dotenv/config");
// require("./database");
const express = require("express");
// const cors = require("cors");
const app = express();

// app.use(cors());
app.use(express.json());

// Firing up the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
