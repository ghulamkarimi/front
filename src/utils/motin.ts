export const fadeIn = (direction: string | number, delay: number) => {
    return {
        hidden: {
            // Startposition abhängig von der Richtung
            y: direction === 'up' ? 40 : direction === "down" ? -40 : 0,
            x: direction === 'left' ? 40 : direction === "right" ? -40 : 0
        },
        show: {
            // Endposition
            y: 0,
            x: 0,
            opacity: 1, // volle Deckkraft
            transition: {
                // Übergangseigenschaften
                type: "tween", // Art des Übergangs
                duration: 1.5, // Dauer des Übergangs in Sekunden
                delay: delay, // Verzögerung des Übergangs in Sekunden
                ease: [0.25, 0.25, 0.25, 0.75] // Easing-Funktion für den Übergang
            }
        }
    }
}
