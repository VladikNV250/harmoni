const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
const DEFAULT_OPTIONS = {
    showMonth: true,
    showYear: true,
    showDay: true,
    useShortMonth: false,
}

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