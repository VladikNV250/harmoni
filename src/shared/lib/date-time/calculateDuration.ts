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