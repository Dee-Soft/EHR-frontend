export interface AuditLog {
  _id: string;
  action: string;
  actorId: string;
  targetId: string;
  targetType: string;
  details: string;
  timestamp: string;
}