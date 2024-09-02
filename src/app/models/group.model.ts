export interface Group {
  id: string;
  groupname: string;
  adminId: string;
  channels: string[];
  users: string[];
  pendingUsers: string[];
}
