import { useEffect, useState } from "react";
import api from "../../utils/api";

const useOfflineDetection = () => {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const checkConnectivity = async () => {
            try {
                await fetch(`${api.defaults.baseURL}/health`, {
                    method: "GET",
                    cache: "no-store",
                });
                setIsOffline(false);
            } catch {
                setIsOffline(true);
            }
        };

        const handleOffline = () => setIsOffline(true);
        const handleOnline = () => checkConnectivity();

        window.addEventListener("offline", handleOffline);
        window.addEventListener("online", handleOnline);

        checkConnectivity();

        return () => {
            window.removeEventListener("offline", handleOffline);
            window.removeEventListener("online", handleOnline);
        };
    }, []);

    return isOffline;
};

export default useOfflineDetection;