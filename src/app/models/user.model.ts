export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  roles: string[]; // e.g., ['Super Admin', 'Group Admin', 'User']
  groups: string[];
  pendingGroups: string[];
}
