const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/channel.json");

function loadChannels() {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  return [];
}

function saveChannels(groups) {
  fs.writeFileSync(filePath, JSON.stringify(groups, null, 2));
}

module.exports = {
  loadChannels,
  saveChannels,
};
