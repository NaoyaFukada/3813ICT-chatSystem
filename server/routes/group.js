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
  },
};
