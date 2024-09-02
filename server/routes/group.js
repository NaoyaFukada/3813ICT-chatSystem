module.exports = {
  route: (app, groups, saveGroups) => {
    // API route to get all groups
    app.get("/api/groups", (req, res) => {
      const adminId = req.query.adminId;
      let filteredGroups = groups;

      if (adminId) {
        filteredGroups = groups.filter((group) => group.adminId === adminId);
      }

      console.log(filteredGroups);

      res.json(filteredGroups);
    });

    // API route to get a specific group by its ID
    app.get("/api/groups/:id", (req, res) => {
      const groupId = req.params.id;
      const group = groups.find((group) => group.id === groupId);

      if (group) {
        res.status(200).json(group);
      } else {
        res.status(404).json({ message: "Group not found" });
      }
    });

    // API route to add a new group
    app.post("/api/groups", (req, res) => {
      const newGroup = req.body;
      console.log(newGroup);
      groups.push(newGroup);
      // Save the new group list to JSON file
      saveGroups(groups);
      res.status(201).json(newGroup);
    });

    // API route to delete a group
    app.delete("/api/groups/:id", (req, res) => {
      const groupId = req.params.id;
      const adminId = req.query.adminId;

      const groupIndex = groups.findIndex(
        (group) => group.id === groupId && group.adminId === adminId
      );

      if (groupIndex !== -1) {
        groups.splice(groupIndex, 1);
        saveGroups(groups); // Save the updated group list to JSON file
        res.status(204).send();
      } else {
        res.status(403).json({
          message: "Forbidden: You don't have permission to delete this group.",
        });
      }
    });

    // API route to add a new channel to a specific group
    app.post("/api/groups/:id/channels", (req, res) => {
      const groupId = req.params.id;
      const { channelName } = req.body;
      console.log(channelName);

      const group = groups.find((group) => group.id === groupId);

      if (group) {
        // Add the new channel to the group's channels array
        group.channels.push(channelName);
        saveGroups(groups); // Save the updated group list to JSON file
        res.status(201).json(group);
      } else {
        res.status(404).json({ message: "Group not found" });
      }
    });

    // API route to update a channel name in a specific group
    app.put("/api/groups/:id/channels/:channelName", (req, res) => {
      const groupId = req.params.id;
      const oldChannelName = req.params.channelName;
      const { newChannelName } = req.body;

      const group = groups.find((group) => group.id === groupId);

      if (group) {
        const channelIndex = group.channels.findIndex(
          (channel) => channel === oldChannelName
        );

        if (channelIndex !== -1) {
          // Update the channel name
          group.channels[channelIndex] = newChannelName;
          saveGroups(groups); // Save the updated group list to JSON file
          res.status(200).json(group);
        } else {
          res.status(404).json({ message: "Channel not found" });
        }
      } else {
        res.status(404).json({ message: "Group not found" });
      }
    });

    // API route to delete a channel from a specific group
    app.delete("/api/groups/:id/channels/:channelName", (req, res) => {
      const groupId = req.params.id;
      const channelName = req.params.channelName;

      const group = groups.find((group) => group.id === groupId);

      if (group) {
        const channelIndex = group.channels.findIndex(
          (channel) => channel === channelName
        );

        if (channelIndex !== -1) {
          group.channels.splice(channelIndex, 1);
          saveGroups(groups);
          res.status(200).json(group);
        } else {
          res.status(404).json({ message: "Channel not found" });
        }
      } else {
        res.status(404).json({ message: "Group not found" });
      }
    });
  },
};
