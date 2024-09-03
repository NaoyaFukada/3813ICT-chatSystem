module.exports = {
  route: (app, users, groups, saveGroups, saveUsers) => {
    // API route to get all users
    app.get("/api/users", (req, res) => {
      res.json(users);
    });

    // API route to approve interest
    app.put("/api/groups/:id/approve", (req, res) => {
      const groupId = req.params.id;
      const userId = req.body.userId;

      const group = groups.find((group) => group.id === groupId);
      const user = users.find((user) => user.id === userId);

      if (group && user) {
        // Remove the user from the group's pending users
        group.pendingUsers = group.pendingUsers.filter((id) => id !== userId);

        // Add the user to the group's users
        group.users.push(userId);

        // Add the group to the user's list of groups
        if (!user.groups.includes(groupId)) {
          user.groups.push(groupId);
        }

        // Remove the group from the user's interest groups
        user.interest_groups = user.interest_groups.filter(
          (id) => id !== groupId
        );

        // Save the updated groups and users
        saveGroups(groups);
        saveUsers(users);

        res.status(200).json(group);
      } else {
        res.status(404).json({ message: "Group or user not found" });
      }
    });

    // API route to decline interest
    app.put("/api/groups/:id/decline", (req, res) => {
      const groupId = req.params.id;
      const userId = req.body.userId;

      const group = groups.find((group) => group.id === groupId);
      const user = users.find((user) => user.id === userId);

      if (group && user) {
        group.pendingUsers = group.pendingUsers.filter((id) => id !== userId);
        user.interest_groups = user.interest_groups.filter(
          (id) => id !== groupId
        );
        saveGroups(groups);
        saveUsers(users);
        res.status(200).json(group);
      } else {
        res.status(404).json({ message: "Group not found" });
      }
    });

    // API route to ban a user from a specific channel
    app.put("/api/groups/:groupId/channels/:channelId/ban", (req, res) => {
      const { groupId, channelId } = req.params;
      const { userId } = req.body;

      const group = groups.find((group) => group.id === groupId);
      const user = users.find((user) => user.id === userId);

      if (group && user) {
        const channel = group.channels.find(
          (channel) => channel.id === channelId
        );
        if (channel) {
          channel.banned_users.push(userId);
          saveGroups(groups);

          user.banned_channels.push(channelId);
          saveUsers(users);

          console.log("group", group);

          res.status(200).json(group);
        } else {
          res.status(404).json({ message: "Channel not found" });
        }
      } else {
        res.status(404).json({ message: "Group or User not found" });
      }
    });

    app.put("/api/groups/:id/remove", (req, res) => {
      const groupId = req.params.id;
      const userId = req.body.userId;

      const group = groups.find((group) => group.id === groupId);
      const user = users.find((user) => user.id === userId);

      if (group && user) {
        // Remove the user from the group's users array
        group.users = group.users.filter((id) => id !== userId);

        // Remove the group from the user's groups array
        user.groups = user.groups.filter((id) => id !== groupId);

        // Save the updated groups and users
        saveGroups(groups);
        saveUsers(users);

        res.status(200).json(group);
      } else {
        res.status(404).json({ message: "Group or user not found" });
      }
    });

    // API route to report a user to the Super Admin
    app.put("/api/groups/:id/report", (req, res) => {
      const groupId = req.params.id;
      const userId = req.body.userId;

      const group = groups.find((group) => group.id === groupId);
      const user = users.find((user) => user.id === userId);

      if (group && user) {
        // Add the user to the group's reported_users array
        if (!group.reported_users.includes(userId)) {
          group.reported_users.push(userId);
        }

        // Add the group to the user's reported_by_groups array
        if (!user.reported_by_groups) {
          user.reported_by_groups = [];
        }
        if (!user.reported_by_groups.includes(groupId)) {
          user.reported_by_groups.push(groupId);
        }

        // Save the updated group and user data
        saveGroups(groups);
        saveUsers(users);

        console.log(
          `User ${user.username} has been reported to the Super Admin in group ${groupId}`
        );

        res.status(200).json(group);
      } else {
        res.status(404).json({ message: "Group or user not found" });
      }
    });

    // API route to update user role
    app.put("/api/users/:id/role", (req, res) => {
      const userId = req.params.id;
      const { role } = req.body;

      const user = users.find((user) => user.id === userId);

      if (user) {
        user.roles = [role];
        saveUsers(users); // Assuming this function saves the user data
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    });

    // API route to update user profile
    app.put("/api/users/:id", (req, res) => {
      const userId = req.params.id;
      const { username, email } = req.body;

      const user = users.find((user) => user.id === userId);

      if (user) {
        // Check if the username is already taken by another user
        const existingUser = users.find(
          (u) => u.username === username && u.id !== userId
        );
        if (existingUser) {
          return res.status(400).json({
            message: "Username already exists. Please choose another one.",
          });
        }

        // Update the user's profile
        user.username = username;
        user.email = email;

        saveUsers(users); // Save the updated users data
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    });

    // API route to delete a user
    app.delete("/api/users/:id", (req, res) => {
      const userId = req.params.id;

      // Find the user by ID
      const userIndex = users.findIndex((user) => user.id === userId);

      if (userIndex !== -1) {
        // Remove the user from the users array
        users.splice(userIndex, 1);

        // Save the updated users array
        saveUsers(users);

        // Remove the user from all groups they are part of
        groups.forEach((group) => {
          group.users = group.users.filter((id) => id !== userId);
          group.pendingUsers = group.pendingUsers.filter((id) => id !== userId);
          group.reported_users = group.reported_users.filter(
            (id) => id !== userId
          );

          // Save the updated groups array
          saveGroups(groups);
        });

        console.log(`User with ID ${userId} deleted`);

        res.status(200).json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    });
  },
};
