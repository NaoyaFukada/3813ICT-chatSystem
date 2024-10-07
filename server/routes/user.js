module.exports = {
  route: (app, users, groups, saveGroups, saveUsers) => {
    // Get all users
    app.get("/api/users", (req, res) => {
      res.json(users);
    });

    // Get user by ID
    app.get("/api/users/:id", (req, res) => {
      const userId = req.params.id;

      // Find the user by ID
      const user = users.find((user) => user.id === userId);

      if (user) {
        res
          .status(200)
          .json({ id: user.id, username: user.username, email: user.email });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    });

    // Add a new user
    app.post("/api/users", (req, res) => {
      const newUser = req.body;

      // Check if the username is already taken
      const existingUser = users.find(
        (user) => user.username === newUser.username
      );
      if (existingUser) {
        return res.status(400).json({
          message: "Username already exists. Please choose another one.",
        });
      }

      // Add the new user to the users array
      users.push(newUser);

      // Save the updated users array
      saveUsers(users);

      console.log(`New user created: ${newUser.username}`);

      res.status(201).json(newUser);
    });

    // Update user role
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

    // Update user profile
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

    // Delete a user
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
