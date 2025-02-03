import { IEpisode } from "shared/api/episode";
import { displayDate } from "shared/lib";

export const getDate = (
    release_date?: IEpisode["release_date"], 
    release_date_precision?: IEpisode["release_date_precision"]
): string => {
    if (release_date && release_date_precision) {
        if (release_date_precision !== "day") {
            return displayDate(release_date, release_date_precision, {
                showYear: false,
                useShortMonth: true,
            });
        } 
            

        const date = new Date(release_date);
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

        return displayDate(release_date, release_date_precision, {
            showYear: false,
            useShortMonth: true
        });
    }
    return "";
}