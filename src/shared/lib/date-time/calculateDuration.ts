export const calculateDuration = (duration_ms: number) => {
    const date = new Date(duration_ms);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    let result = "";
    
    if (hours !== 0) result += `${hours}h`;
    if (minutes !== 0) result += ` ${minutes}min`;
    if (hours === 0 && minutes === 0) result = `${seconds}s`;
        
    return result;
}