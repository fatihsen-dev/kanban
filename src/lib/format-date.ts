import { DateTime } from "luxon";

export default function formatDate(dateString: string | undefined) {
   const date = DateTime.fromISO(dateString ?? "1970-01-01T00:00:00Z");
   return date.toFormat("dd/MM/yyyy HH:mm");
}
