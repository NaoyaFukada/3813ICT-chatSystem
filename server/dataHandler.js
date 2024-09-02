const fs = require("fs");
const path = require("path");

// Path to the users.json file
const usersFilePath = path.join(__dirname, "data/user.json");

// Load users from the JSON file
function loadUsers() {
  return JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
}

// Save users to the JSON file
function saveUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
}

module.exports = {
  loadUsers,
};
