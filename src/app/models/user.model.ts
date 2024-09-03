export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  roles: string[]; // e.g., ['Super_Admin', 'Group_Admin', 'Chat_user']
  groups: string[];
  interest_groups: string[]; // List of group IDs the user is interested in
  banned_channels: string[]; // List of channel IDs where the user is banned
  reported_in_groups: string[]; // List of group IDs where the user has been reported
}
