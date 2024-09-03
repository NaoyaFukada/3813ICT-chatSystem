export interface Group {
  id: string;
  groupname: string;
  adminId: string;
  channels: {
    id: string;
    name: string;
    banned_users: string[];
  }[];
  users: string[];
  pendingUsers: string[];
  reported_users: string[];
}
