const express = require("express"); // Import express.js
const app = express(); // Create an instance of Express
const PORT = 3000;
var cors = require("cors");
const { loadUsers, saveUsers } = require("./handler/userDataHandler");
const { loadGroups, saveGroups } = require("./handler/groupDataHandler");
const { loadChannels, saveChannels } = require("./handler/channelDataHandler");

// Parse URL-encoded bodies and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// This will allow requests from only frontend of this application
var corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Load data from json file
let users = loadUsers();
let groups = loadGroups();
let channels = loadChannels();

// Import and use routes
require("./routes/login").route(app, users);
require("./routes/group").route(app, users, groups, saveGroups, saveUsers);
require("./routes/user").route(app, users, groups, saveGroups, saveUsers);
require("./routes/channel").route(
  app,
  users,
  groups,
  channels,
  saveGroups,
  saveUsers,
  saveChannels
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

module.exports = app;
