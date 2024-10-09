# Project Documentation

Naoya Fukada (s5315403)

## 1. Git Repository Organization

### Branching Strategies

- **main Branch:** The main branch serves as the stable, production-ready branch. All new features are thoroughly tested in their respective branches before being merged into main. This branch is always kept in a deployable state, ensuring that the code here is reliable and ready for release.

- **Feature Branches:** For each main page component, a dedicated feature branch is created and named descriptively to reflect the feature it represents. These branches include both frontend and backend parts. Feature branches used in this project include `feature-admin`, `feature-profile`, `feature-chat`, `feature-explore`, `feature-signup`, and `feature-login`. Each feature branch is independently developed and tested before being merged back into the main branch, enabling more manageable development and reducing the risk of introducing bugs into the production code.

- **Local Branch:** During the second phase of development, a separate branch called 'local' was created to implement MongoDB and Socket.io for real-time communication. This branch was used to ensure that new features could be developed and tested without impacting the stability of the main branch. By isolating the new code in 'local', we minimized the risk of breaking existing functionality in the main branch.

### Update Frequency

- **Commits:** Frequent commits are made to feature branches, ideally after each significant change, such as creating a frontend component or implementing backend logic. Commits are also made after fixing any bugs that are found.

- **Merging:** Feature and local branches are merged into the main branch only after thorough testing.

## 2. Data Structures

For each model in the project, unique identifiers (IDs) are automatically generated. The ID format begins with a prefix (such as "user-"), followed by a random alphanumeric string. This ensures that each ID is unique across the system, avoiding potential conflicts and ensuring consistency in data representation.

### User Model

User model should include the following data types:

- `id: string`
- `username: string`
- `email: string`
- `password: string`
- `roles: string[]`
- `groups: string[]`
- `interest_groups: string[]`
- `banned_channels: string[]`
- `reported_in_groups: string[]`

### Group Model

The Group model includes the following data types:

- `id: string`
- `groupname: string`
- `adminId: string`
- `channels: string`
- `users: string[]`
- `pendingUsers: string[]`
- `reported_users: string[]`

### Channel Model

The channel model includes the following data types:

- `id: string`
- `name: string`
- `users: string[]`
- `pendingUsers: string[]`
- `banned_users: string[]`

## 3. Angular Architecture

### Components

In an Angular project, components are essential for building Single Page Applications (SPAs). Components allow developers to encapsulate specific pieces of the user interface and related functionality, making it easier to manage and maintain the application.

For this project, components are used to structure the application efficiently. Each page of the application, as well as the contents of each tab within those pages, are implemented as separate components. This approach not only organizes the project logically but also improves the overall maintainability of the application.

### Services

Services in Angular are used to centralize and encapsulate shared functionality, reducing the duplication of code across different components. By defining reusable functions and logic in service files, and importing these services into components, Angular components can leverage shared functionality without duplicating code. This not only improves maintainability but also ensures consistency throughout the application.

For this project, services are primarily used to manage data and business logic. Specifically, services provide data as observables, allowing components to subscribe to these data streams. This enables real-time data updates and ensures that the UI remains responsive to changes.

Three service files were created for this project:

- **Authentication Service**

- **User Management Service**

- **Group Management Service**

- **Channel Management Service**

This structured approach ensures that each service is focused on a specific area of the application, promoting separation of concerns and making the codebase easier to maintain.

### Models

Models in Angular are used to define the structure and enforce data types for the objects used throughout the application, especially in service files. Defining models ensures that the data being handled conforms to expected types and structures when interacting with the server. This helps in preventing errors and makes the code more maintainable.

For this project, two models are created:

- **User Model**

- **Group Model**

- **Channel Model**

### Routes

The application routes are defined in `app.routes.ts`. The root route (`/`) is configured to redirect to `/login`, ensuring that users are prompted to log in when they first access the application. Additionally, logic is implemented in `login.ts` to automatically redirect logged-in users to `/chat`, preventing them from accessing the login page unless they log out. The navigation bar is displayed according to the user's role, and if a user attempts to access an unauthorized page, the system is designed to redirect them to an appropriate page. For example, a chat user trying to access the admin page will be redirected to the chat page. For this project, seven paths have been created:

- `/` (root route, redirects to `/login`)
- `/login` (login page)
- `/signup` (registration page)
- `/chat` (main chat interface)
- `/explore` (explore other groups and show an interest to join)
- `/profile` (user profile management)
- `/admin` (administration panel)

## 4. Node Server Architecture

### Module

For this project, both custom and core modules are used.

#### Core modules used:

- **Express:** To create the Node.js server, manage routes, and handle HTTP requests.

- **Fs:** To read and write JSON data for users and groups.

- **Path:** To handle and resolve the path of JSON file.

- **Cors:** To enable Cross-Origin Resource Sharing, allowing requests from the frontend to interact with the backend server.

#### Custom modules used:

- **userDataHandler:** To load and save user data from/to `user.json`.

- **groupDataHandler:** To load and save group data from/to `group.json`.

### Functions

- `loadUsers()`: Loads the users from the `user.json` file and returns them as an array.

- `saveUsers(users)`: Saves the updated users array back to the `user.json` file.

- `loadGroups()`: Loads the groups from the `group.json` file and returns them as an array.

- `saveGroups(groups)`: Saves the updated groups array back to the `group.json` file.

- `loadChannels()`: Loads the channels from the `channel.json` file and returns them as an array.

- `saveChannels(channels)`: Saves the updated channels array back to the `channel.json` file.

### Files

- `server.js`: The main server file that initializes the Express server, loads user and group data, sets up CORS, and imports route files. It also starts the server on a specified port.

- `routes/group.js`: Contains the group-related API routes, such as fetching, creating, updating, and deleting groups.

- `routes/user.js`: Contains the user-related API routes, including fetching users, updating profiles, approving or declining group join requests, and more.

- `routes/login.js`: Handles authentication by checking user credentials and returning user information if valid.

- `routes/channel.js`

- `handler/groupDataHandler.js`

- `handler/userDataHandler.js`

- `handler/channelDataHandler.js`

## 5. Server-Side Routes

### User Routes

- **GET /api/users:** Fetches all users.

  - **Parameters:** None.
  - **Return:** A list of all users in the system.

- **PUT /api/users/:id:** Updates a user's profile.

  - **Parameters:** `id` (User ID), `username`, `email`.
  - **Return:** The updated user object.

- **DELETE /api/users/:id:** Deletes a user.

  - **Parameters:** `id` (User ID).
  - **Return:** Success or failure message.

- **POST /api/users:** Adds a new user.

  - **Parameters:** User object containing `username`, and `password`.
  - **Return:** The newly created user object.

- **PUT /api/groups/:id/approve:** Approves a user's interest in joining a group.

  - **Parameters:** `id` (Group ID), `userId`.
  - **Return:** The updated group object reflecting the user's membership.

- **PUT /api/groups/:id/decline:** Declines a user's interest in joining a group.

  - **Parameters:** `id` (Group ID), `userId`.
  - **Return:** The updated group object with the user removed from pending users.

- **PUT /api/groups/:id/remove:** Removes a user from a group.

  - **Parameters:** `id` (Group ID), `userId`.
  - **Return:** The updated group object without the specified user.

- **PUT /api/groups/:id/channels/:channelId/ban:** Bans a user from a specific channel.

  - **Parameters:** `id` (Group ID), `channelId` (Channel ID), `userId`.
  - **Return:** The updated group object reflecting the banned user in the channel.

- **PUT /api/groups/:id/report:** Reports a user to the Super Admin.

  - **Parameters:** `id` (Group ID), `userId`.
  - **Return:** The updated group object reflecting the reported user.

- **PUT /api/users/:id/role:** Updates a user's role.
  - **Parameters:** `id` (User ID), `role`.
  - **Return:** The updated user object with the new role.

### Group Routes

- **GET /api/groups:** Fetches all groups.

  - **Parameters:** `adminId` (optional).
  - **Return:** A list of groups, filtered by admin ID if provided.

- **GET /api/groups/:id:** Fetches a specific group by its ID.

  - **Parameters:** `id` (Group ID).
  - **Return:** The group object corresponding to the provided ID.

- **POST /api/groups:** Creates a new group.

  - **Parameters:** Group object containing `groupname`, `adminId`, etc.
  - **Return:** The newly created group object.

- **PUT /api/groups/:id/admin-to-super:** Updates a group's admin to "super".

  - **Parameters:** `id` (Group ID).
  - **Return:** Success message after updating the admin to "super".

- **DELETE /api/groups/:id:** Deletes a group.

  - **Parameters:** `id` (Group ID), `adminId`.
  - **Return:** Success or failure message depending on permissions.

- **PUT /api/groups/:id/name:** Updates a group's name.

  - **Parameters:** `id` (Group ID), `newGroupName`.
  - **Return:** The updated group object with the new name.

- **PUT /api/groups/:id/register-interest:** Registers a user's interest in joining a group.
  - **Parameters:** `id` (Group ID), `userId`.
  - **Return:** Success message indicating that the interest was registered.

### Channel Routes

- **POST /api/groups/:id/channels:** Creates a new channel within a specific group and updates the user who created it.

  - **Parameters:** `id` (Group ID), `name`, `users`, `pendingUsers`, `banned_users`.
  - **Return:** Returns the updated group with the new channel ID.

- **GET /api/channels/:id:** Retrieves the details of a specific channel.

  - **Parameters:** `id` (Channel ID).
  - **Return:** The details of the requested channel, including users, pending users, and banned users.

- **PUT /api/channels/:channelId:** Updates the name of a specific channel.

  - **Parameters:** `channelId`, `newChannelName`.
  - **Return:** The updated channel object.

- **DELETE /api/groups/:id/channels/:channelId:** Deletes a channel from a specific group.

  - **Parameters:** `id` (Group ID), `channelId`.
  - **Return:** Success message indicating that the channel has been deleted.

- **PUT /api/channels/:channelId/approveUser:** Approves a user to join the channel.

  - **Parameters:** `channelId`, `userId`.
  - **Return:** The updated user object after being added to the channel.

- **PUT /api/channels/:channelId/declineUser:** Declines a user's request to join the channel.

  - **Parameters:** `channelId`, `userId`.
  - **Return:** The updated user object.

- **PUT /api/channels/:channelId/banUser:** Bans a user from a specific channel.

  - **Parameters:** `channelId`, `userId`.
  - **Return:** The updated user object showing the user as banned from the channel.

- **PUT /api/channels/:channelId/requestToJoin:** Registers a user's interest in joining a specific channel.

  - **Parameters:** `channelId`, `userId`.
  - **Return:** Success message indicating that the request to join has been registered, along with the updated channel and user objects.

- **GET /api/channels/:channelId/messages:** Retrieves the chat history for a specific channel.

  - **Parameters**: channelId

  - **Return**: A list of messages for the specified channel.

- **GET /api/upload-image**: Uploads an image to the server and returns the file path where the image is stored.

  - **Return**: The URL of the uploaded image.

### Login Routes

- **POST /api/auth:** Checks user’s credentials.
  - **Parameters:** `username`, `password`.
  - **Return:** Logged in user info.

## 6. Client-Server Architecture

In this project, the responsibilities are divided between the client (Angular frontend) and the server (Node.js backend):

- **Client (Frontend)**: The Angular frontend is responsible for displaying the user interface, managing the application’s components, handling user interactions, and making HTTP requests to the server. It interacts with the server by consuming the REST API, which returns JSON data. This data is used to update the interface dynamically, such as loading user or group information.

- **Server (Backend)**: The Node.js backend is responsible for handling the business logic, interacting with the database (MongoDB and JSON files), and providing the REST API endpoints that the client uses. The server processes incoming requests from the client, performs operations such as creating or updating records, and returns the requested data in JSON format. The server also manages user authentication and access control, ensuring secure communication between the frontend and backend.

This clear separation of concerns ensures that the frontend focuses on rendering the user interface and managing user interactions, while the backend handles data storage, business logic, and security.

## 7. Testing

### Integration Testing for Backend Routes

```bash
npm run-script test-group
npm run-script test-channel
npm run-script test-user
```

### Unit Testing for Frontend

```bash
ng test
```
