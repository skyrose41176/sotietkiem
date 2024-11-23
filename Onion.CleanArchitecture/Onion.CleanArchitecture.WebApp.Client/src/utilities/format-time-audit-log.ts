
import moment from 'moment';
export function formatTimeAuditLog(dateString:string) {
  const date = moment(dateString);
  return date.format('hh:mm A DD/MM/YYYY');
}