module.exports = {
  route: (app, users, groups, saveGroups, saveUsers) => {
    // API route to get all groups
    app.get("/api/groups", (req, res) => {
      const adminIds = req.query.adminId ? [].concat(req.query.adminId) : null;

      let filteredGroups = groups;

      if (adminIds) {
        filteredGroups = groups.filter((group) =>
          adminIds.includes(group.adminId)
        );
      }

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

      // Add the new group to the groups list
      groups.push(newGroup);

      // Find the admin in the users list and update their groups array
      const adminUser = users.find((user) => user.id === newGroup.adminId);
      if (adminUser) {
        adminUser.groups.push(newGroup.id);
      }

      // Save the updated groups and users lists to their respective JSON files
      saveGroups(groups);
      saveUsers(users);

      // Respond with the newly created group
      res.status(201).json(newGroup);
    });

    // API route to update group adminId to "super"
    app.put("/api/groups/:id/admin-to-super", (req, res) => {
      const groupId = req.params.id;

      const group = groups.find((group) => group.id === groupId);

      console.log(group);

      if (group) {
        group.adminId = "super";
        saveGroups(groups);
        res
          .status(200)
          .json({ message: 'Group adminId updated to "super" successfully' });
      } else {
        res.status(404).json({ message: "Group not found" });
      }
    });

    // API route to delete a group
    app.delete("/api/groups/:id", (req, res) => {
      const groupId = req.params.id;
      const adminId = req.query.adminId;

      // Find the group by ID
      const groupIndex = groups.findIndex(
        (group) =>
          group.id === groupId &&
          (group.adminId === adminId || group.adminId === "super")
      );

      if (groupIndex !== -1) {
        // Remove the group from the groups array
        groups.splice(groupIndex, 1);

        // Find the admin in the users list and remove the group from their groups array
        const adminUser = users.find((user) => user.id === adminId);
        if (adminUser) {
          adminUser.groups = adminUser.groups.filter((id) => id !== groupId);
        }

        // Save the updated groups and users lists to their respective JSON files
        saveGroups(groups);
        saveUsers(users);

        // Send a no-content response
        res.status(204).send();
      } else {
        res.status(403).json({
          message: "Forbidden: You don't have permission to delete this group.",
        });
      }
    });

    // API route to update a group name
    app.put("/api/groups/:id/name", (req, res) => {
      const groupId = req.params.id;
      const { newGroupName } = req.body;

      const group = groups.find((group) => group.id === groupId);

      if (group) {
        group.groupname = newGroupName; // Update the group name
        saveGroups(groups); // Save the updated group list to JSON file
        res.status(200).json(group);
      } else {
        res.status(404).json({ message: "Group not found" });
      }
    });

    // API route to add a new channel to a specific group
    app.post("/api/groups/:id/channels", (req, res) => {
      const groupId = req.params.id;
      const { id, name, banned_users } = req.body; // Destructure id, name, and banned_users from the request body

      const group = groups.find((group) => group.id === groupId);

      if (group) {
        // Add the new channel with banned_users to the group's channels array
        group.channels.push({ id, name, banned_users });
        saveGroups(groups); // Save the updated group list to JSON file
        res.status(201).json(group);
      } else {
        res.status(404).json({ message: "Group not found" });
      }
    });

    // API route to update a channel name in a specific group
    app.put("/api/groups/:id/channels/:channelId", (req, res) => {
      const groupId = req.params.id;
      const channelId = req.params.channelId;
      const { newChannelName } = req.body;

      const group = groups.find((group) => group.id === groupId);

      if (group) {
        const channelIndex = group.channels.findIndex(
          (channel) => channel.id === channelId
        );

        if (channelIndex !== -1) {
          // Update the channel name
          group.channels[channelIndex].name = newChannelName;
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
    app.delete("/api/groups/:id/channels/:channelId", (req, res) => {
      const groupId = req.params.id;
      const channelId = req.params.channelId;

      const group = groups.find((group) => group.id === groupId);

      if (group) {
        const channelIndex = group.channels.findIndex(
          (channel) => channel.id === channelId
        );

        if (channelIndex !== -1) {
          group.channels.splice(channelIndex, 1); // Remove the channel from the group's channels array
          saveGroups(groups); // Save the updated group list to the JSON file
          res.status(200).json(group); // Return the updated group
        } else {
          res.status(404).json({ message: "Channel not found" });
        }
      } else {
        res.status(404).json({ message: "Group not found" });
      }
    });
  },
};
