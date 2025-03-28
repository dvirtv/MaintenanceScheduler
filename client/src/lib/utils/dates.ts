/**
 * Format a date string to DD/MM/YYYY format
 * @param dateString - Date string in ISO format (YYYY-MM-DD)
 * @returns Formatted date string (DD/MM/YYYY)
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return "-";
  }
}

/**
 * Format a date to a long readable format in Hebrew
 * @param dateString - Date string in ISO format (YYYY-MM-DD)
 * @returns Formatted date string in long format
 */
export function formatLongDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    
    // Hebrew month names
    const hebrewMonths = [
      "ינואר", "פברואר", "מרץ", "אפריל", 
      "מאי", "יוני", "יולי", "אוגוסט", 
      "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
    ];
    
    return `${date.getDate()} ב${hebrewMonths[date.getMonth()]}, ${date.getFullYear()}`;
  } catch (e) {
    console.error("Error formatting long date:", e);
    return "-";
  }
}

/**
 * Get the number of days between the current date and a target date
 * @param dateString - Date string in ISO format (YYYY-MM-DD)
 * @returns Number of days difference (positive if in future, negative if in past)
 */
export function getDaysUntil(dateString: string | null | undefined): number | null {
  if (!dateString) return null;
  
  try {
    const targetDate = new Date(dateString);
    if (isNaN(targetDate.getTime())) return null;
    
    const today = new Date();
    // Reset hours to compare dates only
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (e) {
    console.error("Error calculating days until date:", e);
    return null;
  }
}

/**
 * Check if a date is in the past
 * @param dateString - Date string in ISO format (YYYY-MM-DD)
 * @returns Boolean indicating if the date is in the past
 */
export function isPastDate(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    return date < today;
  } catch (e) {
    console.error("Error checking if date is in the past:", e);
    return false;
  }
}

/**
 * Get the current date in ISO format (YYYY-MM-DD)
 * @returns Current date in ISO format
 */
export function getCurrentDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}
