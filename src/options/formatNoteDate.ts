/**
 * Formats an ISO date string into a clear, user-friendly format.
 *
 * @param isoDate - The ISO 8601 date string to format
 * @returns A formatted date string like "08 May 2025, 11:15"
 */
export function formatNoteDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) {
    return isoDate;
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
