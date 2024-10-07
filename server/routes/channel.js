module.exports = {
  route: (
    app,
    users,
    groups,
    channels,
    saveGroups,
    saveUsers,
    saveChannels
  ) => {
    // Get channel detail by its id
    app.get("/api/channels/:id", (req, res) => {
      const channelId = req.params.id;
      const channel = channels.find((channel) => channel.id === channelId);

      if (channel) {
        res.status(200).json(channel);
      } else {
        res.status(404).json({ message: "Channel not found" });
      }
    });

    // Add a new channel to a specific group and update the user
    app.post("/api/groups/:id/channels", (req, res) => {
      const groupId = req.params.id;
      const { id, name, users, pendingUsers, banned_users } = req.body; // Destructure channel properties from the request body

      const group = groups.find((group) => group.id === groupId);

      if (group) {
        // Create the new channel object
        const newChannel = { id, name, users, pendingUsers, banned_users };

        channels.push(newChannel);
        saveChannels(channels); // Save to channels.json

        // Add only the channel ID to the group's channels array
        group.channels.push(newChannel.id);
        saveGroups(groups); // Save the updated group data

        // Update the user who created the channel (first user in the 'users' array)
        users.forEach((user) => {
          if (newChannel.users.includes(user.id)) {
            // Add the new channel ID to the user's channels array
            user.channels.push(newChannel.id);
          }
        });
        saveUsers(users); // Save the updated user data

        res.status(201).json(group); // Return the updated group with the new channel ID
      } else {
        res.status(404).json({ message: "Group not found" });
      }
    });

    // Update a channel name by its ID
    app.put("/api/channels/:channelId", (req, res) => {
      const channelId = req.params.channelId;
      const { newChannelName } = req.body; // Get the new channel name from the request body

      let channelFound = false;

      // Find the channel in any group by its ID
      channels.forEach((group) => {
        const channel = channels.find((channel) => channel.id === channelId);
        if (channel) {
          channel.name = newChannelName; // Update the channel name
          channelFound = true;
          saveChannels(channels);
          res.status(200).json(channel);
        }
      });

      if (!channelFound) {
        res.status(404).json({ message: "Channel not found" });
      }
    });

    // Delete a channel from a specific group
    app.delete("/api/groups/:id/channels/:channelId", (req, res) => {
      const groupId = req.params.id;
      const channelId = req.params.channelId;

      // Find the group by its ID
      const group = groups.find((group) => group.id === groupId);

      if (group) {
        // Find the channel index in the group's channels array
        const channelIndex = group.channels.findIndex(
          (channelID) => channelID === channelId // Directly comparing the string IDs
        );

        if (channelIndex !== -1) {
          // Remove the channel from the group's channels array
          group.channels.splice(channelIndex, 1);
          saveGroups(groups); // Save the updated groups.json

          // Now remove the channel from channels.json
          channels = channels.filter((channel) => channel.id !== channelId); // Remove the specific channel
          console.log(channels);
          saveChannels(channels); // Save the updated channels.json

          res.status(200).json({ message: "Channel Deleted successfully" });
        } else {
          res.status(404).json({ message: "Channel not found" });
        }
      } else {
        res.status(404).json({ message: "Group not found" });
      }
    });

    // Request to join a channel
    app.put("/api/channels/:channelId/requestToJoin", (req, res) => {
      const { channelId } = req.params;
      const { userId } = req.body; // Get the user ID from the request body

      // Find the channel by ID
      const channelIndex = channels.findIndex(
        (channel) => channel.id === channelId
      );
      if (channelIndex === -1) {
        return res.status(404).json({ message: "Channel not found" });
      }

      // Find the user by ID
      const userIndex = users.findIndex((user) => user.id === userId);
      if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get the channel and user objects
      const channel = channels[channelIndex];
      const user = users[userIndex];

      // Add the user to channel's pendingUsers if they are not already there
      if (!channel.pendingUsers.includes(userId)) {
        channel.pendingUsers.push(userId);
      }

      // Add the channel to user's interest_channels if not already present
      if (!user.interest_channels.includes(channelId)) {
        user.interest_channels.push(channelId);
      }

      // Save the updated channels and users back to their JSON files
      saveChannels(channels);
      saveUsers(users);

      res.status(200).json({
        message: "Request to join channel sent",
        channel,
        user,
      });
    });

    // Approve user request to join a channel
    app.put("/api/channels/:channelId/approveUser", (req, res) => {
      const { channelId } = req.params;
      const { userId } = req.body; // Get the user ID from the request body

      // Find the channel by ID
      const channelIndex = channels.findIndex(
        (channel) => channel.id === channelId
      );
      if (channelIndex === -1) {
        return res.status(404).json({ message: "Channel not found" });
      }

      // Find the user by ID
      const userIndex = users.findIndex((user) => user.id === userId);
      if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get the channel and user objects
      const channel = channels[channelIndex];
      const user = users[userIndex];

      // Remove the user from pendingUsers if they are in it, and add them to users
      channel.pendingUsers = channel.pendingUsers.filter((u) => u !== userId);
      if (!channel.users.includes(userId)) {
        channel.users.push(userId);
      }

      // Remove the channel from user's interest_channels and add it to channels
      user.interest_channels = user.interest_channels.filter(
        (ch) => ch !== channelId
      );
      if (!user.channels.includes(channelId)) {
        user.channels.push(channelId);
      }

      // Save the updated channels and users back to their JSON files
      saveChannels(channels);
      saveUsers(users);

      res.status(200).json({ user });
    });

    // Decline user request to join channel
    app.put("/api/channels/:channelId/declineUser", (req, res) => {
      const { channelId } = req.params;
      const { userId } = req.body; // Get the user ID from the request body

      // Find the channel by ID
      const channelIndex = channels.findIndex(
        (channel) => channel.id === channelId
      );
      if (channelIndex === -1) {
        return res.status(404).json({ message: "Channel not found" });
      }

      // Find the user by ID
      const userIndex = users.findIndex((user) => user.id === userId);
      if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get the channel and user objects
      const channel = channels[channelIndex];
      const user = users[userIndex];

      // Remove the user from pendingUsers if they are in it
      channel.pendingUsers = channel.pendingUsers.filter((u) => u !== userId);

      // Remove the channel from user's interest_channels
      user.interest_channels = user.interest_channels.filter(
        (ch) => ch !== channelId
      );

      // Save the updated channels and users back to their JSON files
      saveChannels(channels);
      saveUsers(users);

      res.status(200).json({ user });
    });

    // Ban a user from a channel
    app.put("/api/channels/:channelId/banUser", (req, res) => {
      const { channelId } = req.params;
      const { userId } = req.body; // Get the user ID from the request body

      // Find the channel by ID
      const channelIndex = channels.findIndex(
        (channel) => channel.id === channelId
      );
      if (channelIndex === -1) {
        return res.status(404).json({ message: "Channel not found" });
      }

      // Find the user by ID
      const userIndex = users.findIndex((user) => user.id === userId);
      if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get the channel and user objects
      const channel = channels[channelIndex];
      const user = users[userIndex];

      // Remove the user from channel's users and add them to banned_users
      channel.users = channel.users.filter((u) => u !== userId);
      if (!channel.banned_users.includes(userId)) {
        channel.banned_users.push(userId);
      }

      // Remove the channel from user's channels and add it to banned_channels
      user.channels = user.channels.filter((ch) => ch !== channelId);
      if (!user.banned_channels.includes(channelId)) {
        user.banned_channels.push(channelId);
      }

      // Save the updated channels and users back to their JSON files
      saveChannels(channels);
      saveUsers(users);

      res.status(200).json({ user });
    });
  },
};
