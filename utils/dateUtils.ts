import { format, formatDistanceToNow, isSameDay, parseISO } from "date-fns";

export const formatTime = (isoDateString: string) => {
  const date = parseISO(isoDateString);
  const now = new Date();

  if (isSameDay(date, now)) {
    return format(date, "hh:mm a");
  } else {
    return formatDistanceToNow(date, { addSuffix: true });
  }
}
