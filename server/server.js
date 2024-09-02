const express = require("express"); // Import express.js
const app = express(); // Create an instance of Express
const PORT = 3000;
var cors = require("cors");
const { loadUsers, saveUsers } = require("./dataHandler");

// Parse URL-encoded bodies and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// This will allow requests from only frontend of this application
var corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Load users from the JSON file when the server starts
let users = loadUsers();

// Import and use routes
require("./routes/login").route(app, users, saveUsers);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

module.exports = app;
