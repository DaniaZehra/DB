import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WeatherAlerts = () => {
    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const location = "Honduras"; 
                const response = await fetch(`http://localhost:5000/alerts?location=${location}`);
                const data = await response.json();

                if (data.alerts && data.alerts.length > 0) {
                    data.alerts.forEach((alert) => {
                        toast.error(`🚨 ${alert.event}: ${alert.desc}`, {
                            position: "top-right",
                            autoClose: false,
                        });
                    });
                }
            } catch (error) {
                console.error("Failed to fetch weather alerts:", error);
            }
        };

        fetchAlerts();
    }, []);

    return (
        <div>
            <ToastContainer />
        </div>
    );
};

export default WeatherAlerts;
