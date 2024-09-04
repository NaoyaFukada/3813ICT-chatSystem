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

    // API route to register interest in a group
    app.put("/api/groups/:id/register-interest", (req, res) => {
      const groupId = req.params.id;
      const userId = req.body.userId;

      const group = groups.find((group) => group.id === groupId);
      const user = users.find((user) => user.id === userId);

      if (group && user) {
        // Add user to the group's pendingUsers list if not already added
        if (!group.pendingUsers.includes(userId)) {
          group.pendingUsers.push(userId);
        }

        // Add group to the user's interest_groups list if not already added
        if (!user.interest_groups.includes(groupId)) {
          user.interest_groups.push(groupId);
        }

        // Save the updated groups and users lists to their respective JSON files
        saveGroups(groups);
        saveUsers(users);

        res.status(200).json({ message: "Interest registered successfully" });
      } else {
        res.status(404).json({ message: "Group or user not found" });
      }
    });
  },
};
