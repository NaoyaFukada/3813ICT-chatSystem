export interface Channel {
  id: string;
  name: string;
  users: string[];
  pendingUsers: string[];
  banned_users: string[];
}
