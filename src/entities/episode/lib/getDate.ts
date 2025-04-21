import { IEpisode } from "shared/api/episode";
import { displayDate } from "shared/lib";

/**
 * @function getDate
 * @description
 * Formats an episode's release date based on Spotify's precision rules.
 *
 * If the precision is less than a day (e.g., "month" or "year"), we show a
 * simplified short format to match Spotify's UX. If it's a full date:
 *
 * - If it's today, we return "Today" to highlight freshness.
 * - If it's within the past 6 days, we use the weekday name (e.g., "Tue")
 *   to keep the UI concise and intuitive.
 * - Otherwise, we fall back to a consistent short-date format.
 *
 * @param {IEpisode["release_date"]} rawDate - The raw release date from the API.
 * @param {IEpisode["release_date_precision"]} datePrecision - Indicates how precise the release date is.
 * @returns {string} A formatted date string to be displayed in the UI.
 */
export const getDate = (
    rawDate?: IEpisode["release_date"], 
    datePrecision?: IEpisode["release_date_precision"]
): string => {
    if (rawDate && datePrecision) {
        if (datePrecision !== "day") {
            return displayDate(rawDate, datePrecision, {
                showYear: false,
                useShortMonth: true,
            });
        } 
            

        const date = new Date(rawDate);
        const today = new Date();

        date.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (today.getTime() === date.getTime())
            return "Today";

        const DAYS_OF_WEEK = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];
        const SIX_DAYS_MS = 6 * 24 * 60 * 60 * 1000; 
        const thisWeek = new Date(today.getTime() - SIX_DAYS_MS);

        if (date >= thisWeek && date <= today)
            return DAYS_OF_WEEK[date.getDay()];

        return displayDate(rawDate, datePrecision, {
            showYear: false,
            useShortMonth: true
        });
    }
    return "";
}