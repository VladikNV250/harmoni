const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
const DEFAULT_OPTIONS = {
    showMonth: true,
    showYear: true,
    showDay: true,
    useShortMonth: false,
}

/**
 * @function displayDate
 * @description Formats an raw date based on Spotify's precision rules. 
 * 
 * Typically used for album's or episode's release date to convert into better UI string format.
 * 
 * @param {string} date Raw date in the format "YYYY-MM-DD" (e.g, "1981-02-27")
 * @param {"year" | "month" | "day"} [precision="year"] Precision of the input date. If precision "month", date will be format "1981-02".  
 * @param {{
 *  showMonth?: boolean,
 *  showYear?: boolean,
 *  showDay?: boolean,
 *  useShortMonth?: boolean
 * }} options Optional formatting options:
 * - `showMonth` - Whether to include the month in the output.
 * - `showYear` - Whether to include the year.
 * - `showDay` - Whether to include the day.
 * - `useShortMonth` - Whether to use short month names (e.g., "Aug" instead of "August").
 * 
 * @returns {string} Formatted date based on precision and formatting options.
 * 
 * @example
 * displayDate("1991-08-24", "day", { useShortMonth: true }); // "24 Aug 1991"
 * displayDate("1981-02", "month") // "February 1981"
 */
export const displayDate = (
    date: string = "", 
    precision: "year" | "month" | "day" = "year",
    options: {
        readonly showMonth?: boolean,
        readonly showYear?: boolean,
        readonly showDay?: boolean,
        readonly useShortMonth?: boolean,
    } = DEFAULT_OPTIONS
) => {
    const dateArr = date.split("-");

    let year = "";
    let month = "";
    let day = "";

    if (options.showYear ?? true) year = dateArr[0] ?? "1970"; 
    if (options.showMonth ?? true) {
        const monthIndex = parseInt(dateArr[1] ?? "01", 10) - 1;
        if (options.useShortMonth ?? false) month = SHORT_MONTHS[monthIndex]
        else month = MONTHS[monthIndex];
    } 
    if (options.showDay ?? true) day = dateArr[2] ?? "1";

    switch (precision) {
        case "year" : return year;
        case "month": return (`${month} ${year}`).trim();
        case "day"  : return (`${day} ${month} ${year}`).trim();
        default: return date;
    }
}