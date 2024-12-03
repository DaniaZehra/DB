import fetch from "node-fetch";

export const getWeatherAlerts = async (req, res) => {
    const { location } = req.query;

    if (!location) {
        return res.status(400).json({ error: "Location is required" });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.weatherapi.com/v1/alerts.json?key=${apiKey}&q=${location}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.alerts && data.alerts.alert.length > 0) {
            res.json({ alerts: data.alerts.alert });
        } else {
            res.json({ alerts: [] });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to fetch weather alerts" });
    }
};
