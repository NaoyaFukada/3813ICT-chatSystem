export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  roles: string[]; // e.g., ['Super_Admin', 'Group_Admin', 'User']
  groups: string[];
  pendingGroups: string[];
}
