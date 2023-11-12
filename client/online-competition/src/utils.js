export function FormatSeconds(total) {
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total - (hours * 3600)) / 60);
    const seconds = total - (hours * 3600) - (minutes * 60);

    return `${hours.toString().padStart(2, "0")} óra ${minutes.toString().padStart(2, "0")} perc ${seconds.toString().padStart(2, "0")} másodperc`;
}