/**
 * Get CSS class based on priority level
 * @param priority - Priority level string
 * @returns CSS class string for styling
 */
export function getPriorityClass(priority: string): string {
  switch (priority) {
    case "דחופה":
      return "text-danger border-danger data-[state=active]:text-white data-[state=active]:bg-danger";
    case "גבוהה":
      return "text-warning border-warning data-[state=active]:text-white data-[state=active]:bg-warning";
    case "בינונית":
      return "text-secondary border-secondary data-[state=active]:text-white data-[state=active]:bg-secondary";
    case "נמוכה":
      return "text-primary border-primary data-[state=active]:text-white data-[state=active]:bg-primary";
    default:
      return "";
  }
}

/**
 * Get CSS class for priority badge
 * @param priority - Priority level string
 * @returns CSS class string for badge styling
 */
export function getPriorityBadgeClass(priority: string): string {
  switch (priority) {
    case "דחופה":
      return "bg-danger text-white";
    case "גבוהה":
      return "bg-warning text-white";
    case "בינונית":
      return "bg-secondary text-white";
    case "נמוכה":
      return "bg-primary text-white";
    default:
      return "bg-neutral-medium text-neutral-dark";
  }
}

/**
 * Get CSS class for status badge
 * @param status - Status string
 * @returns CSS class string for badge styling
 */
export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "פתוחה":
      return "bg-primary text-white";
    case "בטיפול":
      return "bg-warning text-white";
    case "ממתינה לחלקים":
      return "bg-secondary text-white";
    case "הושלמה":
      return "bg-success text-white";
    case "בוטלה":
      return "bg-neutral-dark text-white";
    default:
      return "bg-neutral-medium text-neutral-dark";
  }
}

/**
 * Get CSS class for equipment status
 * @param status - Equipment status string
 * @returns CSS class string for styling
 */
export function getEquipmentStatusClass(status: string): string {
  switch (status) {
    case "פעיל":
      return "bg-success text-white";
    case "לא פעיל":
      return "bg-danger text-white";
    case "דורש בדיקה":
      return "bg-warning text-white";
    case "בתחזוקה":
      return "bg-primary-light text-white";
    case "מושבת":
      return "bg-neutral-dark text-white";
    default:
      return "bg-neutral-medium text-neutral-dark";
  }
}
