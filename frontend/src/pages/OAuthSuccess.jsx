import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const token = params.get("token");
        const role = params.get("role");

        console.log("OAuthSuccess params:", token, role);

        if (!token || !role) {
            navigate("/", { replace: true });
            return;
        }

        // Save auth data
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        // Redirect based on role
        if (role === "admin") {
            navigate("/admin/dashboard", { replace: true });
        } else if (role === "faculty") {
            navigate("/faculty/dashboard", { replace: true });
        } else if (role === "student") {
            navigate("/student/dashboard", { replace: true });
        } else {
            // fallback
            navigate("/", { replace: true });
        }

    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Signing you in...</p>
        </div>
    );
};

export default OAuthSuccess;