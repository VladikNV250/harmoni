/**
 * @function calculateDuration
 * @description Converts a duration in milliseconds into a human-readable string format.
 * Supports two types of notation: "word" and "colon".
 * 
 * Typically used to format duration of track or episodes into better UI string format. 
 * 
 * @param {number} duration_ms Duration measured in milliseconds.
 * @param {"word" | "colon"} [notationType="word"] Format type:
 * - "word" - returns a string like `3h 12min`, `24min`, `48s`.
 * - "colon" - returns a string like `4:20:12`, `2:04`, `0:12`.  
 * @returns {string} Formatted duration string based on the selected notation type.
 * 
 * @example
 * calculateDuration(5020000, "word");  // "1h 23min"
 * calculateDuration(5020000, "colon"); // "1:23:20"
 */
export const calculateDuration = (duration_ms: number, notationType: "word" | "colon" = "word") => {
    const date = new Date(duration_ms);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    let result = "";

    if (notationType === "word") {
        if (hours !== 0) result += `${hours}h`;
        if (minutes !== 0) result += ` ${minutes}min`;
        if (hours === 0 && minutes === 0) result = `${seconds}s`;
    } else if (notationType === "colon") {
        if (hours !== 0 ) result += `${hours}:`;
        result += `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    return result;
}